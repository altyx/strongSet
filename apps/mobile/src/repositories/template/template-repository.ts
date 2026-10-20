import {Template, TemplateExercise, TemplateInput} from "@/src/repositories/template/template-type";
import {getDatabase} from "@/src/db/database";

const now = () => Math.floor(Date.now() / 1000);

type TemplateRow = {
  template_id: number;
  template_name: string;
  template_created_at: number;
  template_updated_at: number | null;
  exercise_id: number | null;
  exercise_name: string | null;
  equipment: string | null;
  exercise_note: string | null;
  template_exercise_note: string | null;
  target_sets: number | null;
  target_reps: number | null;
  rest_seconds: number | null;
};

const TEMPLATE_SELECT = `
  SELECT
    t.id as template_id,
    t.name as template_name,
    t.created_at as template_created_at,
    t.updated_at as template_updated_at,
    te.note as template_exercise_note,
    te.target_sets,
    te.target_reps,
    te.rest_seconds,
    e.id as exercise_id,
    e.name as exercise_name,
    e.equipment,
    e.note as exercise_note
  FROM templates t
  LEFT JOIN template_exercises te ON t.id = te.template_id
  LEFT JOIN exercises e ON te.exercise_id = e.id`;

// Regroupe les lignes (un programme × ses exercices) en programmes, dans l'ordre des lignes
function toTemplates(rows: TemplateRow[]): Template[] {
  const templatesMap = new Map<number, Template>();

  rows.forEach((row) => {
    let template = templatesMap.get(row.template_id);
    if (!template) {
      template = {
        id: row.template_id,
        name: row.template_name,
        created_at: row.template_created_at,
        updated_at: row.template_updated_at ?? undefined,
        exercises: [],
      };
      templatesMap.set(row.template_id, template);
    }

    if (row.exercise_id !== null) {
      const exercise: TemplateExercise = {
        id: row.exercise_id,
        name: row.exercise_name ?? '',
        equipment: row.equipment ?? undefined,
        note: row.exercise_note ?? undefined,
        template_exercise_note: row.template_exercise_note ?? undefined,
        target_sets: row.target_sets,
        target_reps: row.target_reps,
        rest_seconds: row.rest_seconds,
      };
      template.exercises.push(exercise);
    }
  });

  return Array.from(templatesMap.values());
}

function insertExercises(templateId: number, input: TemplateInput, timestamp: number) {
  const db = getDatabase();
  input.exercises.forEach((exercise, position) => {
    db.runSync(
      `INSERT INTO template_exercises (template_id, exercise_id, position, target_sets, target_reps, rest_seconds, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [templateId, exercise.exercise_id, position, exercise.target_sets, exercise.target_reps, exercise.rest_seconds, timestamp],
    );
  });
}

export const TemplateRepository = {
  // Programmes du plus récent au plus ancien, exercices dans l'ordre du programme
  getAllTemplates: (): Template[] => {
    return toTemplates(
      getDatabase().getAllSync<TemplateRow>(`${TEMPLATE_SELECT} ORDER BY t.created_at DESC, t.id DESC, te.position, te.id`),
    );
  },

  getTemplate: (id: number): Template | null => {
    const templates = toTemplates(
      getDatabase().getAllSync<TemplateRow>(`${TEMPLATE_SELECT} WHERE t.id = ? ORDER BY te.position, te.id`, [id]),
    );
    return templates[0] ?? null;
  },

  // @returns l'id du programme créé
  createTemplate: (input: TemplateInput): number => {
    const db = getDatabase();
    const timestamp = now();
    let templateId = 0;
    db.withTransactionSync(() => {
      templateId = db.runSync('INSERT INTO templates (name, created_at) VALUES (?, ?)', [input.name, timestamp]).lastInsertRowId;
      insertExercises(templateId, input, timestamp);
    });
    return templateId;
  },

  // Remplace le nom et la liste complète des exercices du programme
  updateTemplate: (id: number, input: TemplateInput): void => {
    const db = getDatabase();
    const timestamp = now();
    db.withTransactionSync(() => {
      db.runSync('UPDATE templates SET name = ?, updated_at = ? WHERE id = ?', [input.name, timestamp, id]);
      db.runSync('DELETE FROM template_exercises WHERE template_id = ?', [id]);
      insertExercises(id, input, timestamp);
    });
  },

  // Les séances déjà faites avec ce programme sont gardées (leur template_id passe à NULL)
  deleteTemplate: (id: number): void => {
    getDatabase().runSync('DELETE FROM templates WHERE id = ?', [id]);
  },
}
