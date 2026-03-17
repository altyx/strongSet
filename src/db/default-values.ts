/**
 * Default values for the database.
 */
export const DEFAULT_VALUES_DATABASE = `
    INSERT OR IGNORE INTO muscles (id, name, created_at, color)
    VALUES (1, 'Chest', 1609459200, '#FF6B6B');
    INSERT OR IGNORE INTO muscles (id, name, created_at, color)
    VALUES (2, 'Triceps', 1609459200, '#4ECDC4');
    INSERT OR IGNORE INTO muscles (id, name, created_at, color)
    VALUES (3, 'Biceps', 1609459200, '#45B7D1');
    INSERT OR IGNORE INTO muscles (id, name, created_at, color)
    VALUES (4, 'Back', 1609459200, '#96CEB4');
    INSERT OR IGNORE INTO muscles (id, name, created_at, color)
    VALUES (5, 'Shoulders', 1609459200, '#FFEAA7');
    INSERT OR IGNORE INTO muscles (id, name, created_at, color)
    VALUES (6, 'Quadriceps', 1609459200, '#DDA0DD');
    INSERT OR IGNORE INTO muscles (id, name, created_at, color)
    VALUES (7, 'Calves', 1609459200, '#98D8C8');

    INSERT OR IGNORE INTO exercises (id, name, created_at)
    VALUES (1, 'Bench Press', 1609459200);
    INSERT OR IGNORE INTO exercises (id, name, created_at)
    VALUES (2, 'Squat', 1609459200);
    INSERT OR IGNORE INTO exercises (id, name, created_at)
    VALUES (3, 'Deadlift', 1609459200);
    INSERT OR IGNORE INTO exercises (id, name, created_at)
    VALUES (4, 'Pull-ups', 1609459200);
    INSERT OR IGNORE INTO exercises (id, name, created_at)
    VALUES (5, 'Shoulder Press', 1609459200);

    INSERT into templates (id, name, created_at)
    VALUES (1, 'Full Body', 1609459200);
    INSERT into templates (id, name, created_at)
    VALUES (2, 'Chest', 1609459200);


    INSERT OR IGNORE INTO exercise_muscles (exercise_id, muscle_id)
    VALUES (1, 1);
    INSERT OR IGNORE INTO exercise_muscles (exercise_id, muscle_id)
    VALUES (1, 2);
    INSERT OR IGNORE INTO exercise_muscles (exercise_id, muscle_id)
    VALUES (2, 6);
    INSERT OR IGNORE INTO exercise_muscles (exercise_id, muscle_id)
    VALUES (3, 4);
    INSERT OR IGNORE INTO exercise_muscles (exercise_id, muscle_id)
    VALUES (3, 6);
    INSERT OR IGNORE INTO exercise_muscles (exercise_id, muscle_id)
    VALUES (4, 4);
    INSERT OR IGNORE INTO exercise_muscles (exercise_id, muscle_id)
    VALUES (4, 3);
    INSERT OR IGNORE INTO exercise_muscles (exercise_id, muscle_id)
    VALUES (5, 5);

    insert into template_exercises(template_id, exercise_id, created_at)
    VALUES (1, 1, 1609459200),
           (1, 2, 1609459200),
           (1, 3, 1609459200),
           (1, 5, 1609459200);
`;
