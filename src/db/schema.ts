/**
 * SQL Schema for the database.
 */
export const DATABASE_SCHEMA = `
DROP TABLE IF EXISTS templates;
DROP TABLE IF EXISTS workouts;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS template_exercises;
DROP TABLE IF EXISTS workout_exercises;
DROP TABLE IF EXISTS muscles;
DROP TABLE IF EXISTS exercise_muscles;
DROP TABLE IF EXISTS sets;

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
    name        TEXT,
    note        TEXT,
    created_at  INTEGER NOT NULL,
    sync_status TEXT DEFAULT 'local',
    version     INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS exercises (
    id           INTEGER PRIMARY KEY,
    name         TEXT NOT NULL,
    created_at   INTEGER NOT NULL,
    updated_at   INTEGER,
    note TEXT,
    equipment    TEXT,
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
    exercise_name TEXT,
    note        TEXT,
    created_at  INTEGER NOT NULL,
    updated_at  INTEGER,
    sync_status TEXT DEFAULT 'local',
    version     INTEGER DEFAULT 1,
    FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE SET NULL 
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
`;
