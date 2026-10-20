import { BackupRepository, InvalidBackupError } from '@/src/repositories/backup/backup-repository';
import { ExportRepository } from '@/src/repositories/export/export-repository';
import { WorkoutRepository } from '@/src/repositories/workout/workout-repository';
import { createTestDatabase, type TestDatabase } from '@/src/test-utils/test-database';

let mockDb: TestDatabase;
jest.mock('@/src/db/database', () => ({ getDatabase: () => mockDb }));

const T0 = 1_760_000_000;
const NOW = new Date(T0 * 1000);

beforeEach(() => {
  mockDb = createTestDatabase();
  jest.spyOn(Date, 'now').mockReturnValue(T0 * 1000);
});

afterEach(() => {
  mockDb.close();
  jest.restoreAllMocks();
});

// Une séance terminée avec une note et une série validée, plus une séance en cours
function seedWorkouts() {
  const id = WorkoutRepository.startWorkout({
    name: 'Push',
    exercises: [{ exercise_id: 1, name: 'Bench Press', sets: [{ weight: 60, reps: 10 }, { weight: null, reps: 8 }] }],
  });
  WorkoutRepository.setCompleted(WorkoutRepository.getWorkout(id)!.exercises[0].sets[0].id, true);
  WorkoutRepository.updateNote(id, 'Bonne séance');
  WorkoutRepository.finishWorkout(id);
  WorkoutRepository.startWorkout({ name: 'Pull', exercises: [{ exercise_id: 2, name: 'Squat', sets: [{ weight: 100, reps: 5 }] }] });
}

const backupJson = () => JSON.stringify(ExportRepository.getBackup(NOW));

it('getBackup → restore redonne exactement les mêmes lignes, ids compris', () => {
  seedWorkouts();
  const content = backupJson();
  const before = ExportRepository.getBackup(NOW).tables;

  // Données modifiées après la sauvegarde : elles doivent disparaître
  WorkoutRepository.startWorkout({ name: 'Legs', exercises: [{ exercise_id: 3, name: 'Deadlift', sets: [{ weight: 140, reps: 3 }] }] });
  mockDb.runSync('DELETE FROM exercise_muscles');
  mockDb.runSync("UPDATE exercises SET name = 'Renommé' WHERE id = 1");

  BackupRepository.restore(BackupRepository.parse(content));

  expect(ExportRepository.getBackup(NOW).tables).toEqual(before);
});

it('restaure une sauvegarde vide en effaçant toutes les données', () => {
  seedWorkouts();
  const empty = JSON.parse(backupJson());
  Object.keys(empty.tables).forEach((table) => (empty.tables[table] = []));

  BackupRepository.restore(BackupRepository.parse(JSON.stringify(empty)));

  Object.values(ExportRepository.getBackup(NOW).tables).forEach((rows) => expect(rows).toEqual([]));
});

it("accepte une sauvegarde sans une colonne qui a une valeur par défaut (sauvegarde d'avant l'ajout de la colonne)", () => {
  seedWorkouts();
  const backup = JSON.parse(backupJson());
  backup.tables.workouts.forEach((row: Record<string, unknown>) => delete row.sync_status);

  BackupRepository.restore(BackupRepository.parse(JSON.stringify(backup)));

  expect(ExportRepository.getBackup(NOW).tables.workouts).toEqual(
    backup.tables.workouts.map((row: object) => ({ ...row, sync_status: 'local' })),
  );
});

describe('fichier invalide refusé sans rien modifier', () => {
  const variants: [string, (backup: any) => unknown, RegExp][] = [
    ['format_version inconnu', (b) => ({ ...b, format_version: 2 }), /format de sauvegarde/],
    ['schéma différent', (b) => ({ ...b, schema_version: b.schema_version + 1 }), /autre version de l'app/],
    ['pas une sauvegarde', () => ({ hello: 'world' }), /pas une sauvegarde/],
    ['table manquante', (b) => ({ ...b, tables: { ...b.tables, sets: undefined } }), /« sets » est absente/],
    ['table inconnue', (b) => ({ ...b, tables: { ...b.tables, users: [] } }), /« users » est inconnue/],
    [
      'colonne inconnue',
      (b) => ({ ...b, tables: { ...b.tables, workouts: [{ ...b.tables.workouts[0], hacked: 1 }] } }),
      /colonne « hacked »/,
    ],
    [
      'colonne obligatoire absente',
      (b) => ({ ...b, tables: { ...b.tables, workouts: b.tables.workouts.map(({ started_at, ...row }: any) => row) } }),
      /colonne « started_at » manque/,
    ],
    [
      'valeur non scalaire',
      (b) => ({ ...b, tables: { ...b.tables, sets: [{ ...b.tables.sets[0], weight: { kg: 60 } }] } }),
      /valeur de « weight »/,
    ],
  ];

  it.each(variants)('%s', (_label, corrupt, message) => {
    seedWorkouts();
    const before = ExportRepository.getBackup(NOW).tables;
    const content = JSON.stringify(corrupt(JSON.parse(backupJson())));

    expect(() => BackupRepository.parse(content)).toThrow(InvalidBackupError);
    expect(() => BackupRepository.parse(content)).toThrow(message);
    expect(ExportRepository.getBackup(NOW).tables).toEqual(before);
  });

  it('JSON illisible', () => {
    expect(() => BackupRepository.parse('{"format_version": 1,')).toThrow(/pas du JSON valide/);
  });

  it('ligne refusée par la base : la transaction est annulée', () => {
    seedWorkouts();
    const before = ExportRepository.getBackup(NOW).tables;
    const backup = JSON.parse(backupJson());
    // Série rattachée à un exercice de séance qui n'existe pas
    backup.tables.sets.push({ ...backup.tables.sets[0], id: 999, workout_exercise_id: 999 });
    const parsed = BackupRepository.parse(JSON.stringify(backup));

    expect(() => BackupRepository.restore(parsed)).toThrow(/rien n'a été modifié/);
    expect(ExportRepository.getBackup(NOW).tables).toEqual(before);
  });
});
