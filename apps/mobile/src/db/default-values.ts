import { DEFAULT_DESCRIPTIONS_SQL } from './exercise-descriptions';
import { LIBRARY_VARIANTS_SQL } from './library-variants';

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
    INSERT OR IGNORE INTO exercises (id, name, equipment, created_at)
    VALUES (2, 'Squat', 'Barre', 1609459200),
           (3, 'Soulevé de terre', 'Barre', 1609459200),
           (4, 'Tractions', 'Poids du corps', 1609459200),
           (5, 'Développé militaire', 'Barre', 1609459200);

    INSERT OR IGNORE INTO templates (id, name, created_at)
    VALUES (1, 'Full Body', 1609459200);
    INSERT OR IGNORE INTO templates (id, name, created_at)
    VALUES (2, 'Pecs', 1609459200);


    INSERT OR IGNORE INTO exercise_muscles (exercise_id, muscle_id)
    VALUES (1, 1);
    INSERT OR IGNORE INTO exercise_muscles (exercise_id, muscle_id)
    VALUES (1, 2);
    INSERT OR IGNORE INTO exercise_muscles (exercise_id, muscle_id)
    VALUES (2, 6), (2, 8),
           (3, 4), (3, 6), (3, 8), (3, 9),
           (4, 4), (4, 3),
           (5, 5), (5, 2);

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

    -- Dos (26 à 37), épaules (38 à 46), biceps (47 à 53), triceps (54 à 60), avant-bras (61 à 62),
    -- jambes (63 à 79), abdominaux (80 à 87).
    -- Muscles : 1 Chest, 2 Triceps, 3 Biceps, 4 Back, 5 Shoulders, 6 Quadriceps, 7 Calves, 8 Glutes,
    -- 9 Hamstrings, 10 Abs, 11 Forearms.
    INSERT OR IGNORE INTO exercises (id, name, equipment, created_at)
    VALUES (26, 'Rowing barre', 'Barre', 1609459200),
           (27, 'Rowing haltère', 'Haltères', 1609459200),
           (28, 'Rowing T-bar', 'Barre', 1609459200),
           (29, 'Rowing assis à la poulie', 'Poulie', 1609459200),
           (30, 'Rowing machine', 'Machine', 1609459200),
           (31, 'Tirage vertical', 'Poulie', 1609459200),
           (32, 'Tirage vertical prise serrée', 'Poulie', 1609459200),
           (33, 'Tractions supination', 'Poids du corps', 1609459200),
           (34, 'Pull-over à la poulie', 'Poulie', 1609459200),
           (35, 'Haussements d''épaules haltères', 'Haltères', 1609459200),
           (36, 'Hyperextensions', 'Poids du corps', 1609459200),
           (37, 'Soulevé de terre jambes tendues', 'Barre', 1609459200),

           (38, 'Développé militaire haltères', 'Haltères', 1609459200),
           (39, 'Développé épaules machine', 'Machine', 1609459200),
           (40, 'Développé Arnold', 'Haltères', 1609459200),
           (41, 'Élévations latérales haltères', 'Haltères', 1609459200),
           (42, 'Élévations latérales à la poulie', 'Poulie', 1609459200),
           (43, 'Élévations frontales haltères', 'Haltères', 1609459200),
           (44, 'Oiseau haltères', 'Haltères', 1609459200),
           (45, 'Oiseau à la machine', 'Machine', 1609459200),
           (46, 'Face pull', 'Poulie', 1609459200),

           (47, 'Curl barre', 'Barre', 1609459200),
           (48, 'Curl haltères', 'Haltères', 1609459200),
           (49, 'Curl marteau', 'Haltères', 1609459200),
           (50, 'Curl incliné haltères', 'Haltères', 1609459200),
           (51, 'Curl pupitre', 'Barre', 1609459200),
           (52, 'Curl concentré', 'Haltères', 1609459200),
           (53, 'Curl à la poulie', 'Poulie', 1609459200),

           (54, 'Extensions triceps à la poulie', 'Poulie', 1609459200),
           (55, 'Extensions triceps à la corde', 'Poulie', 1609459200),
           (56, 'Barre au front', 'Barre', 1609459200),
           (57, 'Extension nuque haltère', 'Haltères', 1609459200),
           (58, 'Développé couché prise serrée', 'Barre', 1609459200),
           (59, 'Dips entre deux bancs', 'Poids du corps', 1609459200),
           (60, 'Kickback haltère', 'Haltères', 1609459200),

           (61, 'Curl poignets', 'Barre', 1609459200),
           (62, 'Marche du fermier', 'Haltères', 1609459200),

           (63, 'Squat avant', 'Barre', 1609459200),
           (64, 'Presse à cuisses', 'Machine', 1609459200),
           (65, 'Hack squat', 'Machine', 1609459200),
           (66, 'Goblet squat', 'Kettlebell', 1609459200),
           (67, 'Fentes haltères', 'Haltères', 1609459200),
           (68, 'Squat bulgare', 'Haltères', 1609459200),
           (69, 'Leg extension', 'Machine', 1609459200),
           (70, 'Soulevé de terre roumain', 'Barre', 1609459200),
           (71, 'Soulevé de terre sumo', 'Barre', 1609459200),
           (72, 'Leg curl allongé', 'Machine', 1609459200),
           (73, 'Leg curl assis', 'Machine', 1609459200),
           (74, 'Hip thrust', 'Barre', 1609459200),
           (75, 'Abducteurs à la machine', 'Machine', 1609459200),
           (76, 'Kickback fessier à la poulie', 'Poulie', 1609459200),
           (77, 'Adducteurs à la machine', 'Machine', 1609459200),
           (78, 'Mollets debout', 'Machine', 1609459200),
           (79, 'Mollets assis', 'Machine', 1609459200),

           (80, 'Crunch', 'Poids du corps', 1609459200),
           (81, 'Crunch à la poulie', 'Poulie', 1609459200),
           (82, 'Relevés de jambes suspendu', 'Poids du corps', 1609459200),
           (83, 'Gainage', 'Poids du corps', 1609459200),
           (84, 'Gainage latéral', 'Poids du corps', 1609459200),
           (85, 'Roue abdominale', 'Autre', 1609459200),
           (86, 'Russian twist', 'Poids du corps', 1609459200),
           (87, 'Mountain climbers', 'Poids du corps', 1609459200);

    INSERT OR IGNORE INTO exercise_muscles (exercise_id, muscle_id)
    VALUES (26, 4), (26, 3),
           (27, 4), (27, 3),
           (28, 4), (28, 3),
           (29, 4), (29, 3),
           (30, 4), (30, 3),
           (31, 4), (31, 3),
           (32, 4), (32, 3),
           (33, 4), (33, 3),
           (34, 4),
           (35, 4),
           (36, 4), (36, 8), (36, 9),
           (37, 9), (37, 4), (37, 8),

           (38, 5), (38, 2),
           (39, 5), (39, 2),
           (40, 5), (40, 2),
           (41, 5),
           (42, 5),
           (43, 5),
           (44, 5), (44, 4),
           (45, 5), (45, 4),
           (46, 5), (46, 4),

           (47, 3), (47, 11),
           (48, 3),
           (49, 3), (49, 11),
           (50, 3),
           (51, 3),
           (52, 3),
           (53, 3),

           (54, 2),
           (55, 2),
           (56, 2),
           (57, 2),
           (58, 2), (58, 1),
           (59, 2), (59, 1),
           (60, 2),

           (61, 11),
           (62, 11), (62, 4),

           (63, 6), (63, 8),
           (64, 6), (64, 8),
           (65, 6), (65, 8),
           (66, 6), (66, 8),
           (67, 6), (67, 8),
           (68, 6), (68, 8),
           (69, 6),
           (70, 9), (70, 8), (70, 4),
           (71, 8), (71, 9), (71, 6), (71, 4),
           (72, 9),
           (73, 9),
           (74, 8), (74, 9),
           (75, 8),
           (76, 8),
           (77, 6),
           (78, 7),
           (79, 7),

           (80, 10),
           (81, 10),
           (82, 10),
           (83, 10),
           (84, 10),
           (85, 10),
           (86, 10),
           (87, 10), (87, 6);

    INSERT OR IGNORE INTO template_exercises (id, template_id, exercise_id, position, created_at)
    VALUES (1, 1, 1, 0, 1609459200),
           (2, 1, 2, 1, 1609459200),
           (3, 1, 3, 2, 1609459200),
           (4, 1, 5, 3, 1609459200);

    -- Consignes d'exécution des exercices par défaut (exercise-descriptions.ts)
    ${DEFAULT_DESCRIPTIONS_SQL}

    -- Variantes (library-variants.ts), ids 88 et plus
    ${LIBRARY_VARIANTS_SQL}
`;
