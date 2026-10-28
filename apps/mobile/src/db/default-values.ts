import { DEFAULT_DESCRIPTIONS_SQL } from './exercise-descriptions';

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
    INSERT OR IGNORE INTO muscles (id, name, created_at, color)
    VALUES (12, 'Cardio', 1609459200, '#FF8FAB');

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

    -- Variantes : triceps (88 à 97), biceps (98 à 104), avant-bras (105), dos (106 à 119), épaules (120 à 124),
    -- jambes (125 à 138), abdominaux (139 à 144).
    INSERT OR IGNORE INTO exercises (id, name, equipment, created_at)
    VALUES (88, 'Extension triceps poulie haute à un bras', 'Poulie', 1609459200),
           (89, 'Extension triceps poulie haute prise inversée', 'Poulie', 1609459200),
           (90, 'Extension triceps poulie haute barre en V', 'Poulie', 1609459200),
           (91, 'Extension triceps au-dessus de la tête à la poulie', 'Poulie', 1609459200),
           (92, 'Extension nuque à un bras haltère', 'Haltères', 1609459200),
           (93, 'Barre au front haltères', 'Haltères', 1609459200),
           (94, 'Kickback à la poulie', 'Poulie', 1609459200),
           (95, 'Extension triceps machine', 'Machine', 1609459200),
           (96, 'Dips assistés', 'Machine', 1609459200),
           (97, 'Pompes diamant', 'Poids du corps', 1609459200),

           (98, 'Curl barre EZ', 'Barre', 1609459200),
           (99, 'Curl pupitre haltère', 'Haltères', 1609459200),
           (100, 'Curl pupitre machine', 'Machine', 1609459200),
           (101, 'Curl marteau à la corde', 'Poulie', 1609459200),
           (102, 'Curl à la poulie à un bras', 'Poulie', 1609459200),
           (103, 'Curl poulie haute', 'Poulie', 1609459200),
           (104, 'Curl inversé', 'Barre', 1609459200),

           (105, 'Curl poignets inversé', 'Barre', 1609459200),

           (106, 'Tirage vertical prise inversée', 'Poulie', 1609459200),
           (107, 'Tirage vertical à un bras', 'Poulie', 1609459200),
           (108, 'Tirage vertical machine', 'Machine', 1609459200),
           (109, 'Rowing à la poulie à un bras', 'Poulie', 1609459200),
           (110, 'Rowing assis prise large', 'Poulie', 1609459200),
           (111, 'Rowing Pendlay', 'Barre', 1609459200),
           (112, 'Rowing barre supination', 'Barre', 1609459200),
           (113, 'Rowing poitrine appuyée haltères', 'Haltères', 1609459200),
           (114, 'Tractions prise neutre', 'Poids du corps', 1609459200),
           (115, 'Tractions assistées', 'Machine', 1609459200),
           (116, 'Rowing inversé', 'Poids du corps', 1609459200),
           (117, 'Haussements d''épaules barre', 'Barre', 1609459200),
           (118, 'Good morning', 'Barre', 1609459200),
           (119, 'Rack pull', 'Barre', 1609459200),

           (120, 'Élévations latérales à la machine', 'Machine', 1609459200),
           (121, 'Élévations frontales à la poulie', 'Poulie', 1609459200),
           (122, 'Élévations frontales disque', 'Autre', 1609459200),
           (123, 'Oiseau à la poulie', 'Poulie', 1609459200),
           (124, 'Rowing menton', 'Barre', 1609459200),

           (125, 'Squat machine guidée', 'Machine', 1609459200),
           (126, 'Fentes barre', 'Barre', 1609459200),
           (127, 'Fentes marchées haltères', 'Haltères', 1609459200),
           (128, 'Fentes arrière haltères', 'Haltères', 1609459200),
           (129, 'Step-up haltères', 'Haltères', 1609459200),
           (130, 'Leg curl debout', 'Machine', 1609459200),
           (131, 'Soulevé de terre roumain haltères', 'Haltères', 1609459200),
           (132, 'Hip thrust machine', 'Machine', 1609459200),
           (133, 'Glute bridge', 'Poids du corps', 1609459200),
           (134, 'Pull-through à la poulie', 'Poulie', 1609459200),
           (135, 'Abduction à la poulie', 'Poulie', 1609459200),
           (136, 'Mollets à la presse', 'Machine', 1609459200),
           (137, 'Nordic curl', 'Poids du corps', 1609459200),
           (138, 'Kettlebell swing', 'Kettlebell', 1609459200),

           (139, 'Crunch inversé', 'Poids du corps', 1609459200),
           (140, 'Relevés de jambes allongé', 'Poids du corps', 1609459200),
           (141, 'Relevés de genoux à la chaise romaine', 'Poids du corps', 1609459200),
           (142, 'Crunch machine', 'Machine', 1609459200),
           (143, 'Bûcheron à la poulie', 'Poulie', 1609459200),
           (144, 'Pallof press', 'Poulie', 1609459200);

    INSERT OR IGNORE INTO exercise_muscles (exercise_id, muscle_id)
    VALUES (88, 2),
           (89, 2),
           (90, 2),
           (91, 2),
           (92, 2),
           (93, 2),
           (94, 2),
           (95, 2),
           (96, 2), (96, 1), (96, 5),
           (97, 2), (97, 1),

           (98, 3), (98, 11),
           (99, 3),
           (100, 3),
           (101, 3), (101, 11),
           (102, 3),
           (103, 3),
           (104, 11), (104, 3),

           (105, 11),

           (106, 4), (106, 3),
           (107, 4), (107, 3),
           (108, 4), (108, 3),
           (109, 4), (109, 3),
           (110, 4), (110, 5),
           (111, 4), (111, 3),
           (112, 4), (112, 3),
           (113, 4), (113, 3),
           (114, 4), (114, 3),
           (115, 4), (115, 3),
           (116, 4), (116, 3),
           (117, 4),
           (118, 9), (118, 8), (118, 4),
           (119, 4), (119, 8), (119, 9),

           (120, 5),
           (121, 5),
           (122, 5),
           (123, 5), (123, 4),
           (124, 5), (124, 4),

           (125, 6), (125, 8),
           (126, 6), (126, 8),
           (127, 6), (127, 8),
           (128, 6), (128, 8),
           (129, 6), (129, 8),
           (130, 9),
           (131, 9), (131, 8), (131, 4),
           (132, 8), (132, 9),
           (133, 8), (133, 9),
           (134, 8), (134, 9),
           (135, 8),
           (136, 7),
           (137, 9),
           (138, 8), (138, 9), (138, 4),

           (139, 10),
           (140, 10),
           (141, 10),
           (142, 10),
           (143, 10),
           (144, 10);

    -- Compléments : dos (145 à 146), épaules (147 à 150), biceps (151 à 153), triceps (154), avant-bras (155 à
    -- 156), jambes (157 à 166), abdominaux (167 à 170).
    INSERT OR IGNORE INTO exercises (id, name, equipment, created_at)
    VALUES (145, 'Soulevé de terre trap bar', 'Barre', 1609459200),
           (146, 'Lombaires à la machine', 'Machine', 1609459200),

           (147, 'Développé militaire assis', 'Barre', 1609459200),
           (148, 'Développé militaire machine guidée', 'Machine', 1609459200),
           (149, 'Développé landmine', 'Barre', 1609459200),
           (150, 'Rotation externe à la poulie', 'Poulie', 1609459200),

           (151, 'Curl araignée', 'Barre', 1609459200),
           (152, 'Curl Bayesian à la poulie', 'Poulie', 1609459200),
           (153, 'Curl Zottman', 'Haltères', 1609459200),

           (154, 'Dips à la machine', 'Machine', 1609459200),

           (155, 'Rouleau à poignets', 'Autre', 1609459200),
           (156, 'Suspension à la barre', 'Poids du corps', 1609459200),

           (157, 'Pendulum squat', 'Machine', 1609459200),
           (158, 'Presse à cuisses horizontale', 'Machine', 1609459200),
           (159, 'Sissy squat', 'Poids du corps', 1609459200),
           (160, 'Squat sumo haltère', 'Haltères', 1609459200),
           (161, 'Soulevé de terre roumain à une jambe', 'Haltères', 1609459200),
           (162, 'Glute ham raise', 'Machine', 1609459200),
           (163, 'Kickback fessier à la machine', 'Machine', 1609459200),
           (164, 'Adduction à la poulie', 'Poulie', 1609459200),
           (165, 'Mollets à la machine guidée', 'Machine', 1609459200),
           (166, 'Mollets à une jambe haltère', 'Haltères', 1609459200),

           (167, 'Flexions latérales haltère', 'Haltères', 1609459200),
           (168, 'Dead bug', 'Poids du corps', 1609459200),
           (169, 'Crunch bicyclette', 'Poids du corps', 1609459200),
           (170, 'Sit-up décliné', 'Poids du corps', 1609459200);

    INSERT OR IGNORE INTO exercise_muscles (exercise_id, muscle_id)
    VALUES (145, 6), (145, 8), (145, 9), (145, 4),
           (146, 4), (146, 8),

           (147, 5), (147, 2),
           (148, 5), (148, 2),
           (149, 5), (149, 1), (149, 2),
           (150, 5),

           (151, 3),
           (152, 3),
           (153, 3), (153, 11),

           (154, 2), (154, 1),

           (155, 11),
           (156, 11), (156, 4),

           (157, 6), (157, 8),
           (158, 6), (158, 8),
           (159, 6),
           (160, 6), (160, 8),
           (161, 9), (161, 8),
           (162, 9), (162, 8),
           (163, 8),
           (164, 6),
           (165, 7),
           (166, 7),

           (167, 10),
           (168, 10),
           (169, 10),
           (170, 10);

    -- Cardio (171 à 183) : séries en durée et distance. Muscle : 12 Cardio.
    INSERT OR IGNORE INTO exercises (id, name, equipment, tracking, created_at)
    VALUES (171, 'Course à pied', 'Poids du corps', 'duration_distance', 1609459200),
           (172, 'Tapis de course', 'Machine', 'duration_distance', 1609459200),
           (173, 'Marche inclinée sur tapis', 'Machine', 'duration_distance', 1609459200),
           (174, 'Marche', 'Poids du corps', 'duration_distance', 1609459200),
           (175, 'Vélo', 'Autre', 'duration_distance', 1609459200),
           (176, 'Vélo d''intérieur', 'Machine', 'duration_distance', 1609459200),
           (177, 'Vélo elliptique', 'Machine', 'duration_distance', 1609459200),
           (178, 'Rameur', 'Machine', 'duration_distance', 1609459200),
           (179, 'Simulateur d''escalier', 'Machine', 'duration_distance', 1609459200),
           (180, 'Air bike', 'Machine', 'duration_distance', 1609459200),
           (181, 'SkiErg', 'Machine', 'duration_distance', 1609459200),
           (182, 'Natation', 'Autre', 'duration_distance', 1609459200),
           (183, 'Corde à sauter', 'Autre', 'duration_distance', 1609459200);

    INSERT OR IGNORE INTO exercise_muscles (exercise_id, muscle_id)
    VALUES (171, 12), (172, 12), (173, 12), (174, 12), (175, 12), (176, 12), (177, 12), (178, 12), (179, 12), (180, 12), (181, 12), (182, 12), (183, 12);

    INSERT OR IGNORE INTO template_exercises (id, template_id, exercise_id, position, created_at)
    VALUES (1, 1, 1, 0, 1609459200),
           (2, 1, 2, 1, 1609459200),
           (3, 1, 3, 2, 1609459200),
           (4, 1, 5, 3, 1609459200);

    -- Consignes d'exécution des exercices par défaut (exercise-descriptions.ts)
    ${DEFAULT_DESCRIPTIONS_SQL}
`;
