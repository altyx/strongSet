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
    INSERT OR IGNORE INTO muscles (id, name, created_at, color)
    VALUES (8, 'Glutes', 1609459200, '#F7A072');
    INSERT OR IGNORE INTO muscles (id, name, created_at, color)
    VALUES (9, 'Hamstrings', 1609459200, '#C3A6E0');
    INSERT OR IGNORE INTO muscles (id, name, created_at, color)
    VALUES (10, 'Abs', 1609459200, '#F6D365');
    INSERT OR IGNORE INTO muscles (id, name, created_at, color)
    VALUES (11, 'Forearms', 1609459200, '#8FB8DE');

    INSERT OR IGNORE INTO exercises (id, name, equipment, created_at)
    VALUES (1, 'Développé couché', 'Barre', 1609459200);
    INSERT OR IGNORE INTO exercises (id, name, created_at)
    VALUES (2, 'Squat', 1609459200);
    INSERT OR IGNORE INTO exercises (id, name, created_at)
    VALUES (3, 'Deadlift', 1609459200);
    INSERT OR IGNORE INTO exercises (id, name, created_at)
    VALUES (4, 'Pull-ups', 1609459200);
    INSERT OR IGNORE INTO exercises (id, name, created_at)
    VALUES (5, 'Shoulder Press', 1609459200);

    INSERT OR IGNORE INTO templates (id, name, created_at)
    VALUES (1, 'Full Body', 1609459200);
    INSERT OR IGNORE INTO templates (id, name, created_at)
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

    -- Pectoraux (ids 6 à 25). Muscles : 1 Chest, 2 Triceps, 4 Back, 5 Shoulders, 10 Abs.
    -- Le développé couché barre est l'exercice 1 ci-dessus.
    INSERT OR IGNORE INTO exercises (id, name, equipment, created_at)
    VALUES (6, 'Développé couché haltères', 'Haltères', 1609459200),
           (7, 'Développé couché machine guidée', 'Machine', 1609459200),
           (8, 'Développé incliné', 'Barre', 1609459200),
           (9, 'Développé incliné haltères', 'Haltères', 1609459200),
           (10, 'Développé incliné machine guidée', 'Machine', 1609459200),
           (11, 'Développé décliné', 'Barre', 1609459200),
           (12, 'Développé décliné haltères', 'Haltères', 1609459200),
           (13, 'Presse à pectoraux', 'Machine', 1609459200),
           (14, 'Presse à pectoraux inclinée', 'Machine', 1609459200),
           (15, 'Écarté couché haltères', 'Haltères', 1609459200),
           (16, 'Écarté incliné haltères', 'Haltères', 1609459200),
           (17, 'Écarté poulie vis-à-vis', 'Poulie', 1609459200),
           (18, 'Écarté poulie basse', 'Poulie', 1609459200),
           (19, 'Écarté poulie haute', 'Poulie', 1609459200),
           (20, 'Pec deck (butterfly)', 'Machine', 1609459200),
           (21, 'Pull-over haltère', 'Haltères', 1609459200),
           (22, 'Dips', 'Poids du corps', 1609459200),
           (23, 'Pompes', 'Poids du corps', 1609459200),
           (24, 'Pompes inclinées', 'Poids du corps', 1609459200),
           (25, 'Pompes déclinées', 'Poids du corps', 1609459200);

    INSERT OR IGNORE INTO exercise_muscles (exercise_id, muscle_id)
    VALUES (6, 1), (6, 2), (6, 5),
           (7, 1), (7, 2),
           (8, 1), (8, 5), (8, 2),
           (9, 1), (9, 5), (9, 2),
           (10, 1), (10, 5), (10, 2),
           (11, 1), (11, 2),
           (12, 1), (12, 2),
           (13, 1), (13, 2),
           (14, 1), (14, 5),
           (15, 1),
           (16, 1), (16, 5),
           (17, 1),
           (18, 1), (18, 5),
           (19, 1),
           (20, 1),
           (21, 1), (21, 4),
           (22, 1), (22, 2), (22, 5),
           (23, 1), (23, 2), (23, 5), (23, 10),
           (24, 1), (24, 2),
           (25, 1), (25, 5), (25, 2);

    INSERT OR IGNORE INTO template_exercises (id, template_id, exercise_id, position, created_at)
    VALUES (1, 1, 1, 0, 1609459200),
           (2, 1, 2, 1, 1609459200),
           (3, 1, 3, 2, 1609459200),
           (4, 1, 5, 3, 1609459200);
`;
