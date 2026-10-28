/**
 * SQL Schema for the database (version 1).
 * Tant qu'aucune version de l'app n'est publiée, on modifie ce schéma directement (puis on réinstalle l'app en dev :
 * une base déjà en version 1 ne rejoue pas ce script). Dès la première release, il est figé et toute évolution
 * passe par une nouvelle migration dans migrations.ts.
 * Les dates sont des timestamps Unix en secondes.
 */
export const DATABASE_SCHEMA = `
CREATE TABLE IF NOT EXISTS templates (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER,
    note TEXT,
    sync_status TEXT DEFAULT 'local',
    version INTEGER DEFAULT 1                 
);

CREATE TABLE IF NOT EXISTS workouts (
    id          INTEGER PRIMARY KEY,
    template_id INTEGER,
    name        TEXT,
    note        TEXT,
    started_at  INTEGER NOT NULL,
    -- NULL tant que la séance est en cours
    finished_at INTEGER,
    created_at  INTEGER NOT NULL,
    updated_at  INTEGER,
    sync_status TEXT DEFAULT 'local',
    version     INTEGER DEFAULT 1,
    FOREIGN KEY (template_id) REFERENCES templates (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS exercises (
    id           INTEGER PRIMARY KEY,
    name         TEXT NOT NULL,
    created_at   INTEGER NOT NULL,
    updated_at   INTEGER,
    -- Note personnelle de l'utilisateur
    note TEXT,
    -- Consignes d'exécution (position, mouvement, conseil)
    description  TEXT,
    equipment    TEXT,
    -- Ce que l'on saisit pour une série : charge et répétitions, ou durée et distance (cardio)
    tracking     TEXT NOT NULL DEFAULT 'weight_reps' CHECK (tracking IN ('weight_reps', 'duration_distance')),
    sync_status  TEXT DEFAULT 'local',
    version      INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS muscles (
     id INTEGER PRIMARY KEY,
     name TEXT NOT NULL,
     created_at INTEGER NOT NULL,
     color TEXT,
     version INTEGER DEFAULT 1,
    sync_status TEXT DEFAULT 'local'
);

CREATE TABLE IF NOT EXISTS template_exercises (
    id INTEGER PRIMARY KEY,
    template_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    -- Objectifs de l'exercice dans le programme ; NULL = valeurs par défaut des réglages
    target_sets INTEGER,
    target_reps INTEGER,
    rest_seconds INTEGER,
    note TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER,
    sync_status TEXT DEFAULT 'local',
    version INTEGER DEFAULT 1,
    FOREIGN KEY (template_id) REFERENCES templates (id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS workout_exercises (
    id          INTEGER PRIMARY KEY,
    workout_id  INTEGER NOT NULL,
    exercise_id INTEGER,
    -- Copie du nom : la séance reste lisible si l'exercice est supprimé
    exercise_name TEXT,
    position    INTEGER NOT NULL DEFAULT 0,
    -- Repos entre les séries, copié du programme au démarrage ; NULL = valeur par défaut des réglages
    rest_seconds INTEGER,
    note        TEXT,
    created_at  INTEGER NOT NULL,
    updated_at  INTEGER,
    sync_status TEXT DEFAULT 'local',
    version     INTEGER DEFAULT 1,
    FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE SET NULL 
);

CREATE TABLE IF NOT EXISTS sets (
    id                  INTEGER PRIMARY KEY,
    workout_exercise_id INTEGER NOT NULL,
    position            INTEGER NOT NULL,
    -- Charge en kg, NULL tant qu'elle n'est pas saisie (0 pour le poids du corps)
    weight              REAL,
    reps                INTEGER,
    -- Exercices de cardio (tracking = duration_distance) : durée en secondes et distance en mètres, NULL sinon
    duration_seconds    INTEGER,
    distance_meters     INTEGER,
    -- normal, warmup (échauffement : hors volume, records et progression), drop (dégressive), failure (à l'échec)
    type                TEXT NOT NULL DEFAULT 'normal' CHECK (type IN ('normal', 'warmup', 'drop', 'failure')),
    -- NULL tant que la série n'est pas validée
    completed_at        INTEGER,
    created_at          INTEGER NOT NULL,
    updated_at          INTEGER,
    sync_status         TEXT DEFAULT 'local',
    version             INTEGER DEFAULT 1,
    FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS exercise_muscles (
    exercise_id INTEGER NOT NULL,
    muscle_id INTEGER NOT NULL,
    PRIMARY KEY (exercise_id, muscle_id),
    FOREIGN KEY (exercise_id) REFERENCES exercises (id),
    FOREIGN KEY (muscle_id) REFERENCES muscles (id)
);


CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_id ON workout_exercises (workout_id);
-- Utilisé dans getAllTemplates et getTemplateById
CREATE INDEX IF NOT EXISTS idx_template_exercises_template_id
    ON template_exercises (template_id);

-- Utilisé dans le JOIN exercises + CASCADE DELETE
CREATE INDEX IF NOT EXISTS idx_template_exercises_exercise_id
    ON template_exercises (exercise_id);

-- Pour le ON DELETE SET NULL sur exercise_id
CREATE INDEX IF NOT EXISTS idx_workout_exercises_exercise_id
    ON workout_exercises (exercise_id);

CREATE INDEX IF NOT EXISTS idx_exercise_muscles_muscle_id
    ON exercise_muscles (muscle_id);

-- Séries d'un exercice de séance + CASCADE DELETE
CREATE INDEX IF NOT EXISTS idx_sets_workout_exercise_id
    ON sets (workout_exercise_id);

-- Séances de la semaine et historique (tri par date)
CREATE INDEX IF NOT EXISTS idx_workouts_started_at
    ON workouts (started_at);
`;
