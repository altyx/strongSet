/**
 * Consignes d'exécution des exercices par défaut, par id d'exercice (voir default-values.ts) :
 * [installation, exécution, conseil].
 */
export const EXERCISE_DESCRIPTIONS: Record<number, [string, string, string]> = {
  // Exercices de base
  1: [
    'Allongé sur le banc, yeux sous la barre, pieds à plat au sol, omoplates serrées. Prise un peu plus large que les épaules.',
    'Descends la barre contrôlée jusqu’au bas des pectoraux, coudes à environ 45° du buste, puis pousse jusqu’à bras tendus.',
    'Garde les fesses sur le banc et les poignets alignés avec les avant-bras. Utilise les sécurités ou un partenaire pour les séries lourdes.',
  ],
  2: [
    'Barre posée sur les trapèzes, pieds écartés largeur d’épaules, pointes légèrement vers l’extérieur.',
    'Descends en poussant les hanches en arrière et en fléchissant les genoux, jusqu’à ce que les cuisses soient au moins parallèles au sol, puis remonte en poussant dans le sol.',
    'Dos neutre et poitrine haute tout du long, genoux dans l’axe des pieds, talons au sol.',
  ],
  3: [
    'Pieds largeur de hanches, barre au-dessus du milieu des pieds. Saisis-la juste à l’extérieur des jambes, tibias contre la barre.',
    'Gaine-toi, puis pousse dans le sol pour décoller la barre en la gardant au contact des jambes, jusqu’à être debout hanches verrouillées. Redescends en reculant les hanches.',
    'Le dos reste neutre du début à la fin : s’il s’arrondit, la charge est trop lourde. Ne tire pas avec les bras.',
  ],
  4: [
    'Suspendu à la barre, prise en pronation un peu plus large que les épaules, bras tendus.',
    'Tire en abaissant les coudes vers les côtes jusqu’à passer le menton au-dessus de la barre, puis redescends contrôlé jusqu’aux bras tendus.',
    'Évite de te balancer. Trop difficile au début : aide-toi d’un élastique ou d’une machine d’assistance.',
  ],
  5: [
    'Debout, barre devant les épaules, prise un peu plus large que les épaules, fessiers et abdos contractés.',
    'Pousse la barre à la verticale au-dessus de la tête jusqu’à bras tendus, en reculant légèrement la tête pour la laisser passer, puis redescends aux épaules.',
    'Ne cambre pas le bas du dos : serre les fessiers et garde les côtes basses.',
  ],

  // Pectoraux
  6: [
    'Allongé sur le banc, un haltère dans chaque main au niveau de la poitrine, paumes vers les pieds.',
    'Pousse les haltères vers le haut en les rapprochant légèrement, puis redescends lentement jusqu’à sentir l’étirement des pectoraux.',
    'Omoplates serrées et pieds au sol. Les haltères permettent une plus grande amplitude que la barre : profites-en sans forcer sur les épaules.',
  ],
  7: [
    'Banc placé sous la barre guidée, barre au-dessus du bas des pectoraux, prise un peu plus large que les épaules.',
    'Déverrouille la barre, descends-la jusqu’à la poitrine puis pousse jusqu’à bras tendus.',
    'Règle les butées de sécurité juste sous le point le plus bas : pratique pour travailler lourd seul.',
  ],
  8: [
    'Banc incliné à 30-45°, omoplates serrées, prise un peu plus large que les épaules.',
    'Descends la barre jusqu’au haut des pectoraux, puis pousse à la verticale jusqu’à bras tendus.',
    'Une inclinaison trop forte sollicite surtout les épaules : reste autour de 30°.',
  ],
  9: [
    'Banc incliné à 30-45°, un haltère dans chaque main au niveau du haut de la poitrine.',
    'Pousse les haltères vers le haut et légèrement vers l’intérieur, puis redescends lentement.',
    'Garde les coudes un peu sous les épaules pour protéger l’articulation.',
  ],
  10: [
    'Banc incliné placé sous la barre guidée, barre au-dessus du haut des pectoraux.',
    'Descends la barre jusqu’au haut de la poitrine puis pousse jusqu’à bras tendus.',
    'Vérifie que la barre arrive bien au haut des pectoraux et pas au niveau du cou.',
  ],
  11: [
    'Banc décliné, pieds bloqués sous les boudins, prise un peu plus large que les épaules.',
    'Descends la barre jusqu’au bas des pectoraux, puis pousse jusqu’à bras tendus.',
    'Fais-toi passer la barre ou utilise un partenaire : la position tête en bas rend la prise de barre délicate.',
  ],
  12: [
    'Banc décliné, pieds bloqués, un haltère dans chaque main au niveau du bas de la poitrine.',
    'Pousse les haltères vers le haut en les rapprochant, puis redescends contrôlé.',
    'Relève-toi en ramenant les haltères sur les cuisses avant de te redresser.',
  ],
  13: [
    'Assis, dos plaqué au dossier. Règle le siège pour que les poignées soient à hauteur du milieu de la poitrine.',
    'Pousse les poignées devant toi jusqu’à bras presque tendus, puis reviens lentement en gardant la tension.',
    'Garde les omoplates serrées contre le dossier pendant tout le mouvement.',
  ],
  14: [
    'Assis, dos plaqué au dossier, poignées à hauteur du haut de la poitrine.',
    'Pousse les poignées vers le haut et vers l’avant, puis reviens lentement.',
    'Cible le haut des pectoraux : ne laisse pas les épaules remonter vers les oreilles.',
  ],
  15: [
    'Allongé sur un banc plat, haltères au-dessus de la poitrine, paumes face à face, coudes légèrement fléchis.',
    'Ouvre les bras en arc de cercle jusqu’à sentir l’étirement des pectoraux, puis referme comme pour enlacer un arbre.',
    'Garde le même angle aux coudes tout le long et utilise des charges modérées : ce n’est pas un exercice de force.',
  ],
  16: [
    'Banc incliné à 30°, haltères au-dessus du haut de la poitrine, coudes légèrement fléchis.',
    'Ouvre les bras en arc de cercle, puis referme en serrant les pectoraux en haut.',
    'Ne descends pas les coudes trop bas sous le banc pour épargner les épaules.',
  ],
  17: [
    'Debout entre les deux poulies réglées en hauteur, une poignée dans chaque main, un pied devant l’autre, buste légèrement penché.',
    'Ramène les mains l’une vers l’autre devant toi en arc de cercle, puis laisse revenir les bras lentement.',
    'Coudes légèrement fléchis et fixes : c’est l’épaule qui bouge, pas le coude.',
  ],
  18: [
    'Poulies réglées en bas, une poignée dans chaque main, buste droit.',
    'Ramène les mains vers le haut et vers l’intérieur jusqu’à hauteur du menton, puis redescends lentement.',
    'Cible le haut des pectoraux : garde les coudes légèrement fléchis.',
  ],
  19: [
    'Poulies réglées en haut, une poignée dans chaque main, un pied devant l’autre, buste légèrement penché.',
    'Ramène les mains vers le bas et l’une vers l’autre devant le bassin, puis remonte lentement.',
    'Cible le bas des pectoraux : serre fort en fin de mouvement.',
  ],
  20: [
    'Assis, dos plaqué au dossier. Règle le siège pour que les poignées soient à hauteur des épaules.',
    'Ramène les poignées l’une vers l’autre devant la poitrine, marque une pause, puis reviens lentement.',
    'Ne laisse pas les poignées partir trop loin en arrière pour ne pas forcer sur l’avant des épaules.',
  ],
  21: [
    'Allongé en travers ou le long d’un banc, un haltère tenu à deux mains au-dessus de la poitrine, bras presque tendus.',
    'Descends l’haltère derrière la tête en arc de cercle jusqu’à sentir l’étirement, puis ramène-le au-dessus de la poitrine.',
    'Garde les coudes légèrement fléchis et le bassin stable.',
  ],
  22: [
    'En appui sur les barres parallèles, bras tendus, buste légèrement penché vers l’avant.',
    'Descends en fléchissant les coudes jusqu’à ce que les épaules soient au niveau des coudes, puis remonte bras tendus.',
    'Buste penché pour les pectoraux, droit pour les triceps. Ne descends pas plus bas si tu ressens une gêne aux épaules.',
  ],
  23: [
    'Mains au sol un peu plus larges que les épaules, corps gainé et aligné de la tête aux talons.',
    'Descends la poitrine près du sol en fléchissant les coudes, puis pousse jusqu’à bras tendus.',
    'Ne laisse pas le bassin s’affaisser. Trop difficile : commence genoux au sol.',
  ],
  24: [
    'Mains posées sur un banc ou une surface surélevée, corps gainé et aligné.',
    'Descends la poitrine vers le banc, puis pousse jusqu’à bras tendus.',
    'Plus les mains sont hautes, plus c’est facile : idéal pour débuter.',
  ],
  25: [
    'Pieds posés sur un banc, mains au sol un peu plus larges que les épaules, corps gainé.',
    'Descends la poitrine vers le sol, puis pousse jusqu’à bras tendus.',
    'Plus difficile que les pompes classiques et cible davantage le haut des pectoraux.',
  ],

  // Dos
  26: [
    'Debout, genoux fléchis, buste penché à environ 45° dos neutre, barre tenue bras tendus en pronation.',
    'Tire la barre vers le bas du ventre en serrant les omoplates, puis redescends contrôlé.',
    'Le buste ne bouge pas : si tu te redresses pour tirer, allège la charge.',
  ],
  27: [
    'Une main et un genou en appui sur un banc, dos à plat, haltère tenu bras tendu de l’autre côté.',
    'Tire l’haltère vers la hanche en gardant le coude près du corps, puis redescends lentement.',
    'Pense à tirer avec le coude plutôt qu’avec la main, sans tourner le buste.',
  ],
  28: [
    'À cheval sur la barre, genoux fléchis, buste penché dos neutre, poignées en main.',
    'Tire la barre vers la poitrine en serrant les omoplates, puis redescends contrôlé.',
    'Garde le dos neutre et évite de donner de l’élan avec les jambes.',
  ],
  29: [
    'Assis face à la poulie, pieds sur les cale-pieds, genoux légèrement fléchis, poignée en main, dos droit.',
    'Tire la poignée vers le bas du ventre en serrant les omoplates, puis laisse les bras revenir lentement.',
    'Le buste reste quasiment immobile : ne te balance pas d’avant en arrière.',
  ],
  30: [
    'Assis, poitrine contre l’appui, poignées en main bras tendus.',
    'Tire les poignées vers toi en serrant les omoplates, puis reviens lentement.',
    'Garde la poitrine collée à l’appui pour isoler le dos.',
  ],
  31: [
    'Assis, cuisses bloquées sous les boudins, prise large en pronation sur la barre.',
    'Tire la barre vers le haut de la poitrine en abaissant les coudes, puis laisse-la remonter lentement jusqu’aux bras tendus.',
    'Ne tire pas la barre derrière la nuque et évite de te pencher en arrière pour gagner de l’élan.',
  ],
  32: [
    'Assis, cuisses bloquées, poignée serrée (triangle ou prise neutre) en main.',
    'Tire la poignée vers le haut de la poitrine en gardant les coudes près du corps, puis remonte lentement.',
    'Bombe légèrement la poitrine en fin de mouvement pour bien contracter le dos.',
  ],
  33: [
    'Suspendu à la barre, prise en supination largeur d’épaules, bras tendus.',
    'Tire jusqu’à passer le menton au-dessus de la barre, puis redescends contrôlé jusqu’aux bras tendus.',
    'Sollicite davantage les biceps que les tractions en pronation. Garde les jambes immobiles.',
  ],
  34: [
    'Debout face à la poulie haute, barre droite ou corde en main, bras presque tendus, buste légèrement penché.',
    'Abaisse la barre en arc de cercle jusqu’aux cuisses en gardant les bras tendus, puis remonte lentement.',
    'Les coudes restent fixes : c’est l’épaule qui travaille.',
  ],
  35: [
    'Debout, un haltère dans chaque main le long du corps, bras tendus.',
    'Monte les épaules vers les oreilles, marque une pause, puis redescends lentement.',
    'Mouvement vertical uniquement : ne fais pas tourner les épaules.',
  ],
  36: [
    'Sur le banc à lombaires, hanches calées sur l’appui, pieds bloqués, buste aligné avec les jambes.',
    'Descends le buste en fléchissant les hanches, puis remonte jusqu’à être aligné, sans dépasser.',
    'Ne cambre pas en haut du mouvement. Ajoute une charge contre la poitrine pour progresser.',
  ],
  37: [
    'Debout, barre en main bras tendus, pieds largeur de hanches, genoux à peine fléchis.',
    'Descends la barre le long des jambes en poussant les hanches en arrière jusqu’à sentir l’étirement des ischios, puis remonte en contractant les fessiers.',
    'Dos neutre impératif : arrête la descente dès que le dos commence à s’arrondir.',
  ],

  // Épaules
  38: [
    'Assis sur un banc à dossier vertical ou debout, un haltère dans chaque main à hauteur des épaules.',
    'Pousse les haltères au-dessus de la tête jusqu’à bras presque tendus, puis redescends à hauteur des oreilles.',
    'Garde le dos plaqué au dossier et ne cambre pas.',
  ],
  39: [
    'Assis, dos plaqué au dossier, poignées à hauteur des épaules.',
    'Pousse les poignées vers le haut jusqu’à bras presque tendus, puis redescends lentement.',
    'Règle le siège pour que les poignées partent à hauteur des épaules.',
  ],
  40: [
    'Assis, haltères devant le visage, paumes tournées vers toi, coudes devant.',
    'Pousse vers le haut en tournant les poignets pour finir paumes vers l’avant, puis fais le chemin inverse en redescendant.',
    'Mouvement fluide et contrôlé, sans à-coup sur la rotation.',
  ],
  41: [
    'Debout, un haltère dans chaque main le long du corps, coudes légèrement fléchis, buste légèrement penché.',
    'Monte les bras sur les côtés jusqu’à hauteur des épaules, puis redescends lentement.',
    'Mène avec les coudes, pas avec les mains, et ne monte pas plus haut que les épaules. Charges légères.',
  ],
  42: [
    'De profil à la poulie basse, poignée dans la main opposée, bras devant le bassin.',
    'Monte le bras sur le côté jusqu’à hauteur de l’épaule, puis redescends lentement.',
    'La poulie garde une tension constante, même en bas du mouvement.',
  ],
  43: [
    'Debout, haltères devant les cuisses, paumes vers les cuisses.',
    'Monte un bras ou les deux devant toi jusqu’à hauteur des épaules, puis redescends lentement.',
    'Ne te balance pas pour monter la charge.',
  ],
  44: [
    'Buste penché en avant presque à l’horizontale, dos neutre, haltères sous la poitrine, coudes légèrement fléchis.',
    'Écarte les bras sur les côtés jusqu’à hauteur des épaules, puis redescends lentement.',
    'Cible l’arrière des épaules : charges légères et mouvement lent.',
  ],
  45: [
    'Assis face à la machine (position pec deck inversée), poitrine contre l’appui, poignées en main bras tendus devant.',
    'Écarte les bras vers l’arrière jusqu’à être alignés avec les épaules, puis reviens lentement.',
    'Ne serre pas trop les omoplates pour garder le travail sur l’arrière des épaules.',
  ],
  46: [
    'Poulie haute avec corde, prise paumes vers le bas, un pas en arrière, bras tendus devant.',
    'Tire la corde vers le visage en écartant les mains et en montant les coudes, puis reviens lentement.',
    'Excellent pour l’arrière des épaules et la posture : charge modérée, mouvement contrôlé.',
  ],

  // Biceps
  47: [
    'Debout, barre tenue en supination largeur d’épaules, bras tendus, coudes près du corps.',
    'Monte la barre en fléchissant les coudes jusqu’à hauteur des épaules, puis redescends lentement.',
    'Les coudes restent fixes le long du buste. Pas d’élan avec le dos.',
  ],
  48: [
    'Debout ou assis, un haltère dans chaque main, bras tendus, paumes vers l’avant.',
    'Monte les haltères en fléchissant les coudes, en alterné ou ensemble, puis redescends lentement.',
    'Contrôle la descente : c’est là que le muscle travaille le plus.',
  ],
  49: [
    'Debout, un haltère dans chaque main, paumes face à face (prise neutre).',
    'Monte l’haltère en gardant la prise neutre jusqu’à l’épaule, puis redescends.',
    'Sollicite aussi les avant-bras. Coudes fixes.',
  ],
  50: [
    'Assis sur un banc incliné à 45-60°, bras pendants, un haltère dans chaque main.',
    'Monte les haltères en fléchissant les coudes, sans avancer les coudes, puis redescends jusqu’aux bras tendus.',
    'La position étire le biceps au départ : charges plus légères que le curl debout.',
  ],
  51: [
    'Assis au pupitre, arrière des bras posé sur l’appui, barre (droite ou EZ) en supination.',
    'Monte la barre jusqu’à contracter le biceps, puis redescends lentement sans verrouiller les coudes en bas.',
    'Ne décolle pas les bras de l’appui.',
  ],
  52: [
    'Assis, coude calé contre l’intérieur de la cuisse, haltère en main bras tendu.',
    'Monte l’haltère vers l’épaule, marque une pause, puis redescends lentement.',
    'Le buste ne bouge pas : seul l’avant-bras se déplace.',
  ],
  53: [
    'Face à la poulie basse, barre ou poignée en supination, bras tendus, coudes près du corps.',
    'Monte la poignée en fléchissant les coudes, puis redescends lentement.',
    'Tension constante grâce à la poulie : idéal en fin de séance.',
  ],

  // Triceps
  54: [
    'Face à la poulie haute, barre en pronation, coudes collés au corps et fléchis à 90°.',
    'Pousse la barre vers le bas jusqu’à bras tendus, puis remonte jusqu’à l’angle de départ.',
    'Seuls les avant-bras bougent : les coudes ne doivent pas avancer.',
  ],
  55: [
    'Face à la poulie haute, corde en main, coudes collés au corps.',
    'Pousse vers le bas et écarte les extrémités de la corde en fin de mouvement, puis remonte lentement.',
    'L’écartement en bas renforce la contraction : marque une pause.',
  ],
  56: [
    'Allongé sur un banc plat, barre (droite ou EZ) tenue bras tendus au-dessus de la poitrine.',
    'Fléchis les coudes pour descendre la barre vers le front, puis tends les bras.',
    'Les coudes restent pointés vers le plafond. Commence léger : les coudes sont exposés.',
  ],
  57: [
    'Assis ou debout, un haltère tenu à deux mains au-dessus de la tête, bras tendus.',
    'Descends l’haltère derrière la tête en fléchissant les coudes, puis tends les bras.',
    'Coudes près de la tête et dos droit, sans cambrer.',
  ],
  58: [
    'Allongé sur le banc, prise sur la barre largeur d’épaules ou un peu moins.',
    'Descends la barre vers le bas de la poitrine en gardant les coudes près du corps, puis pousse jusqu’à bras tendus.',
    'Une prise trop serrée fait souffrir les poignets : largeur d’épaules suffit.',
  ],
  59: [
    'Mains en appui sur le bord d’un banc derrière toi, jambes tendues ou fléchies devant.',
    'Descends en fléchissant les coudes jusqu’à environ 90°, puis remonte bras tendus.',
    'Garde le dos près du banc. Jambes fléchies pour faciliter, pieds surélevés pour corser.',
  ],
  60: [
    'Buste penché en avant, une main en appui sur un banc, haltère en main, bras collé au corps et coude fléchi à 90°.',
    'Tends le bras vers l’arrière jusqu’à l’alignement avec le buste, puis reviens lentement.',
    'Le bras reste immobile, seul l’avant-bras bouge. Charges légères.',
  ],

  // Avant-bras
  61: [
    'Assis, avant-bras posés sur les cuisses, barre tenue en supination, poignets dans le vide.',
    'Enroule les poignets pour monter la barre, puis redescends lentement en laissant la barre rouler vers les doigts.',
    'Amplitude complète et charges modérées.',
  ],
  62: [
    'Debout, un haltère lourd (ou kettlebell) dans chaque main, bras le long du corps.',
    'Marche sur une distance ou un temps donné en gardant une prise ferme.',
    'Buste droit, épaules basses, pas courts et réguliers.',
  ],

  // Jambes
  63: [
    'Barre posée sur l’avant des épaules, coudes hauts vers l’avant, pieds largeur d’épaules.',
    'Descends en gardant le buste le plus droit possible, puis remonte en poussant dans le sol.',
    'Si les coudes tombent, la barre glisse : travaille la mobilité des poignets ou croise les bras.',
  ],
  64: [
    'Assis, dos plaqué au dossier, pieds largeur de hanches au milieu de la plateforme.',
    'Déverrouille, descends la plateforme en fléchissant les genoux jusqu’à environ 90°, puis pousse sans verrouiller les genoux en haut.',
    'Ne laisse pas le bas du dos décoller du dossier en bas du mouvement.',
  ],
  65: [
    'Dos et épaules calés contre les appuis, pieds largeur d’épaules sur la plateforme.',
    'Descends en fléchissant les genoux le plus bas possible, puis remonte en poussant dans les talons.',
    'Genoux dans l’axe des pieds. Pieds plus hauts pour plus de fessiers.',
  ],
  66: [
    'Debout, haltère ou kettlebell tenu contre la poitrine, pieds un peu plus larges que les épaules.',
    'Descends en poussant les genoux vers l’extérieur, coudes entre les genoux, puis remonte.',
    'Excellent pour apprendre le squat : buste droit, talons au sol.',
  ],
  67: [
    'Debout, un haltère dans chaque main le long du corps.',
    'Fais un grand pas en avant et descends jusqu’à ce que le genou arrière frôle le sol, puis reviens et change de jambe.',
    'Buste droit, genou avant dans l’axe du pied et sans le laisser rentrer vers l’intérieur.',
  ],
  68: [
    'Dos à un banc, pied arrière posé dessus, pied avant à un grand pas devant, haltères en main.',
    'Descends sur la jambe avant jusqu’à ce que la cuisse soit parallèle au sol, puis remonte.',
    'L’essentiel du poids est sur le pied avant. Fais toutes les répétitions d’un côté puis change.',
  ],
  69: [
    'Assis, dos plaqué au dossier, chevilles sous le boudin, genoux alignés avec l’axe de la machine.',
    'Tends les jambes jusqu’en haut, marque une pause, puis redescends lentement.',
    'Évite les à-coups. Charges modérées pour épargner les genoux.',
  ],
  70: [
    'Debout, barre en main bras tendus, genoux légèrement fléchis.',
    'Pousse les hanches en arrière en descendant la barre le long des jambes jusqu’à mi-tibias, puis remonte en contractant les fessiers.',
    'Dos neutre : la descente s’arrête quand les ischios sont étirés, pas quand la barre touche le sol.',
  ],
  71: [
    'Pieds très écartés, pointes vers l’extérieur, barre au-dessus du milieu des pieds, prise entre les jambes.',
    'Pousse dans le sol en écartant les genoux pour décoller la barre, puis termine debout hanches verrouillées.',
    'Dos neutre et barre au contact des jambes, comme au soulevé de terre classique.',
  ],
  72: [
    'Allongé sur le ventre, boudin juste au-dessus des talons, genoux juste après le bord du banc.',
    'Fléchis les jambes pour amener les talons vers les fesses, puis redescends lentement.',
    'Garde les hanches plaquées au banc.',
  ],
  73: [
    'Assis, dos plaqué au dossier, boudin juste au-dessus des talons, cuisses bloquées.',
    'Fléchis les jambes vers l’arrière au maximum, puis reviens lentement.',
    'Contrôle le retour : ne laisse pas la charge te ramener d’un coup.',
  ],
  74: [
    'Haut du dos calé contre un banc, barre (avec protection) sur les hanches, pieds à plat largeur de hanches.',
    'Monte les hanches jusqu’à aligner épaules, hanches et genoux, serre les fessiers en haut, puis redescends.',
    'Menton rentré et côtes basses : c’est la hanche qui monte, pas le bas du dos qui se cambre.',
  ],
  75: [
    'Assis dans la machine, dos droit, extérieur des genoux contre les coussins.',
    'Écarte les jambes au maximum, marque une pause, puis reviens lentement.',
    'Mouvement contrôlé, sans élan.',
  ],
  76: [
    'Face à la poulie basse, sangle à la cheville, mains en appui sur la machine, buste légèrement penché.',
    'Pousse la jambe vers l’arrière en contractant le fessier, puis reviens lentement.',
    'Le bas du dos ne doit pas se cambrer : seule la hanche travaille.',
  ],
  77: [
    'Assis dans la machine, dos droit, intérieur des genoux contre les coussins écartés.',
    'Serre les jambes l’une vers l’autre, puis reviens lentement.',
    'Commence avec une ouverture modérée pour ne pas forcer sur l’aine.',
  ],
  78: [
    'Debout, épaules sous les appuis, avant des pieds sur la marche, talons dans le vide.',
    'Monte sur la pointe des pieds le plus haut possible, puis descends les talons sous la marche.',
    'Amplitude complète et pause en haut : les mollets répondent mieux au contrôle qu’à la charge.',
  ],
  79: [
    'Assis, genoux sous le boudin, avant des pieds sur la marche.',
    'Monte les talons le plus haut possible, puis redescends en étirant.',
    'Genoux fléchis : cible surtout le soléaire, complément des mollets debout.',
  ],

  // Abdominaux
  80: [
    'Allongé sur le dos, genoux fléchis, pieds au sol, mains derrière la tête ou croisées sur la poitrine.',
    'Enroule le buste en décollant les épaules du sol, puis redescends lentement.',
    'Ne tire pas sur la nuque : regarde vers le plafond et expire en montant.',
  ],
  81: [
    'À genoux face à la poulie haute, corde tenue de chaque côté de la tête.',
    'Enroule le buste vers le sol en rapprochant les coudes des genoux, puis reviens lentement.',
    'Les hanches restent fixes : c’est la colonne qui s’enroule.',
  ],
  82: [
    'Suspendu à une barre, bras tendus, corps immobile.',
    'Monte les jambes (fléchies ou tendues) en enroulant le bassin, puis redescends lentement.',
    'Évite le balancement. Jambes fléchies pour débuter.',
  ],
  83: [
    'En appui sur les avant-bras et la pointe des pieds, coudes sous les épaules.',
    'Garde le corps aligné de la tête aux talons pendant le temps voulu.',
    'Serre les fessiers et les abdos, sans laisser le bassin monter ou s’affaisser. Respire normalement.',
  ],
  84: [
    'Sur le côté, en appui sur un avant-bras et le bord du pied, coude sous l’épaule.',
    'Monte le bassin pour aligner le corps et tiens la position, puis change de côté.',
    'Le bassin ne doit pas tomber. Genoux au sol pour faciliter.',
  ],
  85: [
    'À genoux, mains sur les poignées de la roue posée au sol devant toi.',
    'Fais rouler la roue vers l’avant en gardant le dos neutre, aussi loin que tu le contrôles, puis reviens.',
    'Exercice exigeant : réduis l’amplitude tant que le bas du dos se cambre.',
  ],
  86: [
    'Assis, genoux fléchis, buste incliné en arrière dos droit, pieds au sol ou décollés.',
    'Tourne le buste d’un côté puis de l’autre en amenant les mains (ou un poids) près de la hanche.',
    'C’est le buste qui tourne, pas seulement les bras.',
  ],
  87: [
    'En position de pompe, bras tendus, corps gainé.',
    'Ramène un genou vers la poitrine puis l’autre, en alternance rapide.',
    'Garde le bassin bas et les épaules au-dessus des mains.',
  ],
};

// Texte enregistré en base : une ligne par étape, préfixée de son nom
export function formatDescription([installation, execution, tip]: [string, string, string]) {
  return `Installation : ${installation}\nExécution : ${execution}\nConseil : ${tip}`;
}

// Requêtes SQL qui renseignent les descriptions des exercices par défaut
export const DEFAULT_DESCRIPTIONS_SQL = Object.entries(EXERCISE_DESCRIPTIONS)
  .map(
    ([id, steps]) =>
      `UPDATE exercises SET description = '${formatDescription(steps).replace(/'/g, "''")}' WHERE id = ${Number(id)};`,
  )
  .join('\n');
