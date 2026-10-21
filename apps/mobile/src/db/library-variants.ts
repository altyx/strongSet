import { formatDescription } from './exercise-descriptions';

// Muscles : 1 Chest, 2 Triceps, 3 Biceps, 4 Back, 5 Shoulders, 6 Quadriceps, 7 Calves, 8 Glutes, 9 Hamstrings,
// 10 Abs, 11 Forearms.
type LibraryExercise = {
  name: string;
  equipment: string;
  muscleIds: number[];
  // [installation, exécution, conseil]
  description: [string, string, string];
};

/**
 * Variantes de la bibliothèque par défaut (prise, poignée, à un bras…), insérées après les exercices de
 * default-values.ts : leurs ids suivent (88 et plus). Muscles et consignes sont décrits ici plutôt qu'en SQL.
 */
export const LIBRARY_VARIANTS: LibraryExercise[] = [
  // Triceps
  {
    name: 'Extension triceps poulie haute à un bras',
    equipment: 'Poulie',
    muscleIds: [2],
    description: [
      'Face à la poulie haute, poignée simple en main, coude collé au corps et fléchi à 90°.',
      'Tends le bras vers le bas jusqu’à l’extension complète, puis remonte lentement jusqu’à l’angle de départ.',
      'Travailler un bras à la fois corrige les déséquilibres. Commence par le bras le plus faible.',
    ],
  },
  {
    name: 'Extension triceps poulie haute prise inversée',
    equipment: 'Poulie',
    muscleIds: [2],
    description: [
      'Face à la poulie haute, barre droite tenue en supination (paumes vers le haut), coudes collés au corps.',
      'Pousse la barre vers le bas jusqu’à bras tendus, puis remonte jusqu’à 90°.',
      'Charge plus légère qu’en pronation : la prise inversée sollicite davantage les poignets.',
    ],
  },
  {
    name: 'Extension triceps poulie haute barre en V',
    equipment: 'Poulie',
    muscleIds: [2],
    description: [
      'Face à la poulie haute, barre en V en main, coudes collés au corps et fléchis à 90°.',
      'Pousse la barre vers le bas jusqu’à bras tendus, puis remonte jusqu’à l’angle de départ.',
      'La prise neutre est plus confortable pour les poignets et permet souvent de charger plus lourd.',
    ],
  },
  {
    name: 'Extension triceps au-dessus de la tête à la poulie',
    equipment: 'Poulie',
    muscleIds: [2],
    description: [
      'Dos à la poulie (réglée basse ou haute), corde en main derrière la tête, coudes pointés vers l’avant, un pied devant.',
      'Tends les bras vers l’avant et le haut en écartant la corde en fin de mouvement, puis reviens lentement derrière la tête.',
      'Le bras en position haute étire la longue portion du triceps. Garde les coudes fixes et le dos neutre.',
    ],
  },
  {
    name: 'Extension nuque à un bras haltère',
    equipment: 'Haltères',
    muscleIds: [2],
    description: [
      'Assis, dos droit, un haltère tenu bras tendu au-dessus de la tête.',
      'Descends l’haltère derrière la tête en fléchissant le coude, puis tends le bras.',
      'Le coude reste pointé vers le plafond. Aide-toi de l’autre main pour stabiliser le bras.',
    ],
  },
  {
    name: 'Barre au front haltères',
    equipment: 'Haltères',
    muscleIds: [2],
    description: [
      'Allongé sur un banc plat, un haltère dans chaque main, bras tendus au-dessus de la poitrine, paumes face à face.',
      'Fléchis les coudes pour descendre les haltères de chaque côté de la tête, puis tends les bras.',
      'La prise neutre ménage les coudes. Les bras restent verticaux, seuls les avant-bras bougent.',
    ],
  },
  {
    name: 'Kickback à la poulie',
    equipment: 'Poulie',
    muscleIds: [2],
    description: [
      'Face à la poulie basse, buste penché en avant, poignée en main, bras collé au corps et coude fléchi.',
      'Tends le bras vers l’arrière jusqu’à l’alignement avec le buste, puis reviens lentement.',
      'La poulie garde la tension en bas du mouvement, contrairement à l’haltère.',
    ],
  },
  {
    name: 'Extension triceps machine',
    equipment: 'Machine',
    muscleIds: [2],
    description: [
      'Assis, coudes posés sur l’appui, poignées en main, bras fléchis.',
      'Tends les bras jusqu’à l’extension complète, puis reviens lentement.',
      'Règle le siège pour que les coudes soient alignés avec l’axe de rotation de la machine.',
    ],
  },
  {
    name: 'Dips assistés',
    equipment: 'Machine',
    muscleIds: [2, 1, 5],
    description: [
      'Genoux ou pieds sur la plateforme de la machine d’assistance, mains sur les barres parallèles, bras tendus.',
      'Descends en fléchissant les coudes jusqu’à environ 90°, puis pousse jusqu’à bras tendus.',
      'Plus le contrepoids est lourd, plus l’exercice est facile. Réduis-le au fil des séances.',
    ],
  },
  {
    name: 'Pompes diamant',
    equipment: 'Poids du corps',
    muscleIds: [2, 1],
    description: [
      'En position de pompe, mains rapprochées sous la poitrine, pouces et index formant un losange.',
      'Descends la poitrine vers les mains en gardant les coudes près du corps, puis pousse jusqu’à bras tendus.',
      'Corps gainé du début à la fin. Trop difficile : fais-les genoux au sol.',
    ],
  },

  // Biceps
  {
    name: 'Curl barre EZ',
    equipment: 'Barre',
    muscleIds: [3, 11],
    description: [
      'Debout, barre EZ tenue sur les parties inclinées, bras tendus, coudes près du corps.',
      'Monte la barre vers les épaules en fléchissant les coudes, puis redescends lentement.',
      'La barre EZ soulage les poignets par rapport à la barre droite. Évite de balancer le buste.',
    ],
  },
  {
    name: 'Curl pupitre haltère',
    equipment: 'Haltères',
    muscleIds: [3],
    description: [
      'Assis au pupitre, arrière du bras à plat sur l’appui, haltère en main, bras presque tendu.',
      'Monte l’haltère vers l’épaule, puis redescends lentement sans verrouiller le coude en bas.',
      'Un bras à la fois pour bien sentir la contraction. Contrôle la descente, c’est là que le coude est exposé.',
    ],
  },
  {
    name: 'Curl pupitre machine',
    equipment: 'Machine',
    muscleIds: [3],
    description: [
      'Assis, bras à plat sur l’appui, poignées en main, coudes alignés avec l’axe de la machine.',
      'Fléchis les coudes pour monter les poignées, puis redescends lentement.',
      'Règle le siège pour que les aisselles touchent le haut de l’appui.',
    ],
  },
  {
    name: 'Curl marteau à la corde',
    equipment: 'Poulie',
    muscleIds: [3, 11],
    description: [
      'Face à la poulie basse, corde en main, paumes face à face, bras tendus, coudes près du corps.',
      'Monte la corde vers les épaules en gardant la prise neutre, puis redescends lentement.',
      'Travaille aussi le brachial et les avant-bras. Les coudes ne doivent pas avancer.',
    ],
  },
  {
    name: 'Curl à la poulie à un bras',
    equipment: 'Poulie',
    muscleIds: [3],
    description: [
      'Face à la poulie basse, poignée simple en supination, bras tendu, coude près du corps.',
      'Monte la poignée vers l’épaule, marque une pause, puis redescends lentement.',
      'Un bras à la fois pour corriger les déséquilibres. Le buste reste immobile.',
    ],
  },
  {
    name: 'Curl poulie haute',
    equipment: 'Poulie',
    muscleIds: [3],
    description: [
      'Entre les deux poulies hautes d’un vis-à-vis, une poignée dans chaque main, bras tendus à hauteur d’épaules.',
      'Fléchis les coudes pour amener les poignées vers les oreilles, puis tends les bras lentement.',
      'Les bras restent à l’horizontale pendant tout le mouvement : seuls les avant-bras bougent.',
    ],
  },
  {
    name: 'Curl inversé',
    equipment: 'Barre',
    muscleIds: [11, 3],
    description: [
      'Debout, barre tenue en pronation (paumes vers le sol), bras tendus, coudes près du corps.',
      'Monte la barre vers les épaules en fléchissant les coudes, puis redescends lentement.',
      'Cible les avant-bras et le brachial. Charge nettement plus légère qu’un curl classique.',
    ],
  },

  // Avant-bras
  {
    name: 'Curl poignets inversé',
    equipment: 'Barre',
    muscleIds: [11],
    description: [
      'Assis, avant-bras posés sur les cuisses, barre tenue en pronation, poignets dans le vide.',
      'Relève les poignets le plus haut possible, puis redescends lentement.',
      'Charge légère et amplitude complète : les extenseurs du poignet sont peu puissants.',
    ],
  },

  // Dos
  {
    name: 'Tirage vertical prise inversée',
    equipment: 'Poulie',
    muscleIds: [4, 3],
    description: [
      'Assis, cuisses calées, barre tenue en supination largeur d’épaules, bras tendus.',
      'Tire la barre vers le haut de la poitrine en abaissant les coudes le long du corps, puis remonte contrôlé.',
      'Les biceps participent davantage qu’en pronation. Garde la poitrine haute sans te pencher en arrière.',
    ],
  },
  {
    name: 'Tirage vertical à un bras',
    equipment: 'Poulie',
    muscleIds: [4, 3],
    description: [
      'Assis ou à genoux face à la poulie haute, poignée simple en main, bras tendu au-dessus de la tête.',
      'Tire la poignée vers l’épaule en abaissant le coude le long du corps, puis remonte lentement jusqu’à l’étirement.',
      'Permet une grande amplitude et corrige les déséquilibres entre les deux côtés.',
    ],
  },
  {
    name: 'Tirage vertical machine',
    equipment: 'Machine',
    muscleIds: [4, 3],
    description: [
      'Assis, cuisses calées sous les boudins, poignées en main, bras tendus.',
      'Tire les poignées vers le bas en abaissant les coudes vers les côtes, puis remonte contrôlé.',
      'Initie le mouvement en abaissant les épaules, pas en tirant avec les bras.',
    ],
  },
  {
    name: 'Rowing à la poulie à un bras',
    equipment: 'Poulie',
    muscleIds: [4, 3],
    description: [
      'Assis ou debout face à la poulie, poignée simple en main, bras tendu, buste droit.',
      'Tire la poignée vers la hanche en gardant le coude près du corps, puis reviens lentement jusqu’à l’étirement.',
      'Laisse l’épaule avancer en fin de retour pour étirer le dos, sans tourner le buste.',
    ],
  },
  {
    name: 'Rowing assis prise large',
    equipment: 'Poulie',
    muscleIds: [4, 5],
    description: [
      'Assis à la poulie, barre large tenue en pronation, bras tendus, buste droit.',
      'Tire la barre vers le bas de la poitrine en écartant les coudes, puis reviens lentement.',
      'Cible le haut du dos et l’arrière des épaules. Serre les omoplates en fin de tirage.',
    ],
  },
  {
    name: 'Rowing Pendlay',
    equipment: 'Barre',
    muscleIds: [4, 3],
    description: [
      'Buste parallèle au sol, dos neutre, barre posée au sol sous les épaules, prise en pronation.',
      'Tire la barre de façon explosive jusqu’au bas de la poitrine, puis repose-la au sol à chaque répétition.',
      'Le buste ne remonte pas pendant le tirage. Le repos au sol permet de repartir d’une position propre.',
    ],
  },
  {
    name: 'Rowing barre supination',
    equipment: 'Barre',
    muscleIds: [4, 3],
    description: [
      'Debout, buste penché à environ 45°, dos neutre, barre tenue en supination largeur d’épaules.',
      'Tire la barre vers le nombril en gardant les coudes près du corps, puis redescends contrôlé.',
      'Sollicite davantage les biceps et le bas des dorsaux que la prise en pronation.',
    ],
  },
  {
    name: 'Rowing poitrine appuyée haltères',
    equipment: 'Haltères',
    muscleIds: [4, 3],
    description: [
      'Allongé sur le ventre sur un banc incliné, un haltère dans chaque main, bras tendus vers le sol.',
      'Tire les haltères vers les hanches en serrant les omoplates, puis redescends lentement.',
      'L’appui supprime l’élan et soulage le bas du dos.',
    ],
  },
  {
    name: 'Tractions prise neutre',
    equipment: 'Poids du corps',
    muscleIds: [4, 3],
    description: [
      'Suspendu aux poignées parallèles, paumes face à face, bras tendus.',
      'Tire en abaissant les coudes vers les côtes jusqu’à passer le menton au-dessus des poignées, puis redescends contrôlé.',
      'La prise neutre est la plus confortable pour les épaules et les coudes.',
    ],
  },
  {
    name: 'Tractions assistées',
    equipment: 'Machine',
    muscleIds: [4, 3],
    description: [
      'Genoux sur la plateforme de la machine d’assistance, mains sur la barre en pronation, bras tendus.',
      'Tire jusqu’à passer le menton au-dessus de la barre, puis redescends contrôlé jusqu’aux bras tendus.',
      'Plus le contrepoids est lourd, plus l’exercice est facile. Réduis-le au fil des séances.',
    ],
  },
  {
    name: 'Rowing inversé',
    equipment: 'Poids du corps',
    muscleIds: [4, 3],
    description: [
      'Allongé sous une barre fixée à hauteur de hanches, mains en pronation, corps tendu, talons au sol.',
      'Tire la poitrine vers la barre en serrant les omoplates, puis redescends jusqu’aux bras tendus.',
      'Corps gainé et aligné. Plus les pieds sont avancés, plus c’est difficile.',
    ],
  },
  {
    name: "Haussements d'épaules barre",
    equipment: 'Barre',
    muscleIds: [4],
    description: [
      'Debout, barre tenue devant les cuisses, bras tendus, prise largeur d’épaules.',
      'Monte les épaules vers les oreilles, marque une pause, puis redescends lentement.',
      'Ne roule pas les épaules : le mouvement est vertical. Les bras ne fléchissent pas.',
    ],
  },
  {
    name: 'Good morning',
    equipment: 'Barre',
    muscleIds: [9, 8, 4],
    description: [
      'Barre posée sur les trapèzes, pieds largeur de hanches, genoux légèrement fléchis.',
      'Penche le buste en avant en reculant les hanches, dos neutre, jusqu’à sentir l’étirement des ischios, puis remonte.',
      'Commence très léger : le dos doit rester neutre tout du long.',
    ],
  },
  {
    name: 'Rack pull',
    equipment: 'Barre',
    muscleIds: [4, 8, 9],
    description: [
      'Barre posée sur les sécurités du rack, juste sous ou au-dessus des genoux. Prise comme au soulevé de terre.',
      'Gaine-toi et tire la barre en poussant les hanches vers l’avant jusqu’à être debout, puis repose-la contrôlé.',
      'Permet de charger plus lourd que le soulevé de terre : garde le dos neutre et ne te penche pas en arrière.',
    ],
  },

  // Épaules
  {
    name: 'Élévations latérales à la machine',
    equipment: 'Machine',
    muscleIds: [5],
    description: [
      'Assis, épaules alignées avec l’axe de la machine, avant-bras ou mains contre les appuis.',
      'Monte les bras sur les côtés jusqu’à hauteur d’épaules, puis redescends lentement.',
      'Ne hausse pas les épaules : ce sont les deltoïdes qui travaillent, pas les trapèzes.',
    ],
  },
  {
    name: 'Élévations frontales à la poulie',
    equipment: 'Poulie',
    muscleIds: [5],
    description: [
      'Dos à la poulie basse, poignée ou corde passée entre les jambes, bras tendus.',
      'Monte les bras devant toi jusqu’à hauteur d’épaules, puis redescends lentement.',
      'Coudes légèrement fléchis et buste immobile, sans élan.',
    ],
  },
  {
    name: 'Élévations frontales disque',
    equipment: 'Autre',
    muscleIds: [5],
    description: [
      'Debout, un disque tenu à deux mains devant les cuisses, bras tendus.',
      'Monte le disque devant toi jusqu’à hauteur d’yeux, puis redescends lentement.',
      'Garde les côtes basses et le bas du dos neutre, sans balancer.',
    ],
  },
  {
    name: 'Oiseau à la poulie',
    equipment: 'Poulie',
    muscleIds: [5, 4],
    description: [
      'Entre les deux poulies d’un vis-à-vis réglées à hauteur d’épaules, câbles croisés : main droite sur la poulie gauche et inversement.',
      'Écarte les bras vers l’arrière, coudes légèrement fléchis, jusqu’à l’alignement avec les épaules, puis reviens lentement.',
      'Cible l’arrière des épaules. Charge légère, sans serrer exagérément les omoplates.',
    ],
  },
  {
    name: 'Rowing menton',
    equipment: 'Barre',
    muscleIds: [5, 4],
    description: [
      'Debout, barre tenue devant les cuisses en pronation, prise largeur d’épaules.',
      'Tire la barre le long du corps jusqu’au bas de la poitrine en menant avec les coudes, puis redescends lentement.',
      'Ne monte pas les coudes au-dessus des épaules : une prise plus large ménage les épaules.',
    ],
  },

  // Jambes
  {
    name: 'Squat machine guidée',
    equipment: 'Machine',
    muscleIds: [6, 8],
    description: [
      'Barre guidée posée sur les trapèzes, pieds légèrement avancés, écartés largeur d’épaules.',
      'Descends en fléchissant les genoux jusqu’à ce que les cuisses soient parallèles au sol, puis remonte.',
      'Mets les sécurités à la bonne hauteur. Genoux dans l’axe des pieds, talons au sol.',
    ],
  },
  {
    name: 'Fentes barre',
    equipment: 'Barre',
    muscleIds: [6, 8],
    description: [
      'Barre posée sur les trapèzes, debout, pieds largeur de hanches.',
      'Fais un grand pas en avant et descends jusqu’à ce que le genou arrière frôle le sol, puis reviens et change de jambe.',
      'Buste droit. Plus délicat en équilibre qu’avec des haltères : commence léger.',
    ],
  },
  {
    name: 'Fentes marchées haltères',
    equipment: 'Haltères',
    muscleIds: [6, 8],
    description: [
      'Debout, un haltère dans chaque main, bras le long du corps.',
      'Avance d’un grand pas et descends jusqu’à ce que le genou arrière frôle le sol, puis enchaîne avec l’autre jambe en avançant.',
      'Compte une répétition par jambe. Le genou avant reste dans l’axe du pied.',
    ],
  },
  {
    name: 'Fentes arrière haltères',
    equipment: 'Haltères',
    muscleIds: [6, 8],
    description: [
      'Debout, un haltère dans chaque main, pieds largeur de hanches.',
      'Recule une jambe d’un grand pas et descends jusqu’à ce que le genou arrière frôle le sol, puis reviens en poussant sur le talon avant.',
      'Plus douce pour les genoux que la fente avant. Le poids reste sur la jambe avant.',
    ],
  },
  {
    name: 'Step-up haltères',
    equipment: 'Haltères',
    muscleIds: [6, 8],
    description: [
      'Face à un banc ou une box à hauteur de genou, un haltère dans chaque main.',
      'Pose un pied entier sur le banc et monte en poussant sur ce talon, puis redescends contrôlé. Enchaîne les répétitions puis change de jambe.',
      'Ne pousse pas avec la jambe restée au sol : c’est la jambe sur le banc qui fait le travail.',
    ],
  },
  {
    name: 'Leg curl debout',
    equipment: 'Machine',
    muscleIds: [9],
    description: [
      'Debout face à la machine, cuisse contre l’appui, boudin derrière la cheville.',
      'Fléchis le genou pour monter le talon vers les fesses, puis redescends lentement.',
      'Une jambe à la fois. Le bassin reste plaqué contre l’appui.',
    ],
  },
  {
    name: 'Soulevé de terre roumain haltères',
    equipment: 'Haltères',
    muscleIds: [9, 8, 4],
    description: [
      'Debout, un haltère dans chaque main devant les cuisses, genoux légèrement fléchis.',
      'Descends les haltères le long des jambes en reculant les hanches, dos neutre, jusqu’à sentir l’étirement des ischios, puis remonte.',
      'Les genoux restent fixes, c’est la hanche qui bouge. Le dos ne s’arrondit pas.',
    ],
  },
  {
    name: 'Hip thrust machine',
    equipment: 'Machine',
    muscleIds: [8, 9],
    description: [
      'Assis dans la machine, haut du dos contre l’appui, ceinture ou coussin sur les hanches, pieds à plat.',
      'Monte le bassin jusqu’à aligner épaules, hanches et genoux en serrant les fessiers, puis redescends.',
      'Garde le menton rentré et les côtes basses : ne cambre pas en haut.',
    ],
  },
  {
    name: 'Glute bridge',
    equipment: 'Poids du corps',
    muscleIds: [8, 9],
    description: [
      'Allongé sur le dos, genoux fléchis, pieds à plat au sol largeur de hanches.',
      'Monte le bassin en poussant dans les talons jusqu’à aligner épaules, hanches et genoux, puis redescends.',
      'Serre les fessiers en haut. Ajoute un disque ou un haltère sur les hanches pour corser.',
    ],
  },
  {
    name: 'Pull-through à la poulie',
    equipment: 'Poulie',
    muscleIds: [8, 9],
    description: [
      'Dos à la poulie basse, corde passée entre les jambes, pieds un peu plus larges que les hanches.',
      'Recule les hanches en laissant la corde passer entre les jambes, dos neutre, puis pousse les hanches vers l’avant pour te redresser.',
      'Les bras ne tirent pas : c’est l’extension de hanche qui ramène la corde.',
    ],
  },
  {
    name: 'Abduction à la poulie',
    equipment: 'Poulie',
    muscleIds: [8],
    description: [
      'De profil à la poulie basse, sangle à la cheville extérieure, main en appui pour l’équilibre.',
      'Écarte la jambe sur le côté, jambe tendue, puis reviens lentement.',
      'Mouvement court et contrôlé : le buste ne se penche pas.',
    ],
  },
  {
    name: 'Mollets à la presse',
    equipment: 'Machine',
    muscleIds: [7],
    description: [
      'Assis à la presse à cuisses, avant des pieds sur le bas du plateau, jambes tendues sans verrouiller.',
      'Pousse le plateau avec la pointe des pieds le plus loin possible, puis reviens lentement jusqu’à l’étirement.',
      'Garde les sécurités engagées : le plateau ne doit pas glisser des pieds.',
    ],
  },
  {
    name: 'Nordic curl',
    equipment: 'Poids du corps',
    muscleIds: [9],
    description: [
      'À genoux sur un tapis, chevilles bloquées sous un appui ou tenues par un partenaire, corps droit.',
      'Penche-toi en avant le plus lentement possible en gardant hanches et genoux alignés, puis amortis avec les mains et remonte.',
      'Exercice très exigeant : la descente lente suffit au début.',
    ],
  },
  {
    name: 'Kettlebell swing',
    equipment: 'Kettlebell',
    muscleIds: [8, 9, 4],
    description: [
      'Debout, pieds un peu plus larges que les hanches, kettlebell tenu à deux mains devant toi.',
      'Fais passer le kettlebell entre les jambes en reculant les hanches, puis projette-le jusqu’à hauteur de poitrine par une extension de hanches explosive.',
      'Ce sont les hanches qui donnent l’élan, pas les bras ni les épaules. Dos neutre tout du long.',
    ],
  },

  // Abdominaux
  {
    name: 'Crunch inversé',
    equipment: 'Poids du corps',
    muscleIds: [10],
    description: [
      'Allongé sur le dos, bras le long du corps, genoux fléchis à 90°, pieds décollés.',
      'Enroule le bassin pour ramener les genoux vers la poitrine en décollant les fesses, puis redescends lentement.',
      'Pas d’élan : c’est le bassin qui s’enroule, pas les jambes qui se balancent.',
    ],
  },
  {
    name: 'Relevés de jambes allongé',
    equipment: 'Poids du corps',
    muscleIds: [10],
    description: [
      'Allongé sur le dos, jambes tendues, mains sous les fesses ou le long du corps.',
      'Monte les jambes jusqu’à la verticale, puis redescends lentement sans toucher le sol.',
      'Le bas du dos reste plaqué au sol. Plie les genoux pour faciliter.',
    ],
  },
  {
    name: 'Relevés de genoux à la chaise romaine',
    equipment: 'Poids du corps',
    muscleIds: [10],
    description: [
      'Avant-bras sur les appuis, dos contre le dossier, jambes pendantes.',
      'Monte les genoux vers la poitrine en enroulant le bassin, puis redescends lentement.',
      'Plus accessible que suspendu. Jambes tendues pour corser.',
    ],
  },
  {
    name: 'Crunch machine',
    equipment: 'Machine',
    muscleIds: [10],
    description: [
      'Assis, poignées ou appuis en main, pieds calés.',
      'Enroule le buste vers les genoux en contractant les abdos, puis reviens lentement.',
      'Ce sont les abdos qui tirent, pas les bras. Expire en enroulant.',
    ],
  },
  {
    name: 'Bûcheron à la poulie',
    equipment: 'Poulie',
    muscleIds: [10],
    description: [
      'De profil à la poulie réglée haute, poignée tenue à deux mains, bras tendus, pieds écartés.',
      'Tire la poignée en diagonale vers la hanche opposée en tournant le buste, puis reviens lentement.',
      'La rotation vient du tronc, les bras restent tendus. Fais les deux côtés.',
    ],
  },
  {
    name: 'Pallof press',
    equipment: 'Poulie',
    muscleIds: [10],
    description: [
      'De profil à la poulie réglée à hauteur de poitrine, poignée tenue à deux mains contre le sternum.',
      'Tends les bras devant toi sans laisser le buste tourner, tiens une seconde, puis ramène la poignée.',
      'Exercice d’anti-rotation : le buste reste immobile. Fais les deux côtés.',
    ],
  },
];

const sqlString = (value: string) => `'${value.replace(/'/g, "''")}'`;

export const LIBRARY_VARIANTS_SQL = LIBRARY_VARIANTS.map(({ name, equipment, muscleIds, description }) => {
  const exerciseId = `(SELECT id FROM exercises WHERE name = ${sqlString(name)})`;
  return `
    INSERT INTO exercises (name, equipment, description, created_at)
    VALUES (${sqlString(name)}, ${sqlString(equipment)}, ${sqlString(formatDescription(description))}, 1609459200);
    INSERT INTO exercise_muscles (exercise_id, muscle_id)
    VALUES ${muscleIds.map((muscleId) => `(${exerciseId}, ${muscleId})`).join(', ')};`;
}).join('\n');
