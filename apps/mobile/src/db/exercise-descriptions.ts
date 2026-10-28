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

  // Triceps (variantes)
  88: [
    'Face à la poulie haute, poignée simple en main, coude collé au corps et fléchi à 90°.',
    'Tends le bras vers le bas jusqu’à l’extension complète, puis remonte lentement jusqu’à l’angle de départ.',
    'Travailler un bras à la fois corrige les déséquilibres. Commence par le bras le plus faible.',
  ],
  89: [
    'Face à la poulie haute, barre droite tenue en supination (paumes vers le haut), coudes collés au corps.',
    'Pousse la barre vers le bas jusqu’à bras tendus, puis remonte jusqu’à 90°.',
    'Charge plus légère qu’en pronation : la prise inversée sollicite davantage les poignets.',
  ],
  90: [
    'Face à la poulie haute, barre en V en main, coudes collés au corps et fléchis à 90°.',
    'Pousse la barre vers le bas jusqu’à bras tendus, puis remonte jusqu’à l’angle de départ.',
    'La prise neutre est plus confortable pour les poignets et permet souvent de charger plus lourd.',
  ],
  91: [
    'Dos à la poulie (réglée basse ou haute), corde en main derrière la tête, coudes pointés vers l’avant, un pied devant.',
    'Tends les bras vers l’avant et le haut en écartant la corde en fin de mouvement, puis reviens lentement derrière la tête.',
    'Le bras en position haute étire la longue portion du triceps. Garde les coudes fixes et le dos neutre.',
  ],
  92: [
    'Assis, dos droit, un haltère tenu bras tendu au-dessus de la tête.',
    'Descends l’haltère derrière la tête en fléchissant le coude, puis tends le bras.',
    'Le coude reste pointé vers le plafond. Aide-toi de l’autre main pour stabiliser le bras.',
  ],
  93: [
    'Allongé sur un banc plat, un haltère dans chaque main, bras tendus au-dessus de la poitrine, paumes face à face.',
    'Fléchis les coudes pour descendre les haltères de chaque côté de la tête, puis tends les bras.',
    'La prise neutre ménage les coudes. Les bras restent verticaux, seuls les avant-bras bougent.',
  ],
  94: [
    'Face à la poulie basse, buste penché en avant, poignée en main, bras collé au corps et coude fléchi.',
    'Tends le bras vers l’arrière jusqu’à l’alignement avec le buste, puis reviens lentement.',
    'La poulie garde la tension en bas du mouvement, contrairement à l’haltère.',
  ],
  95: [
    'Assis, coudes posés sur l’appui, poignées en main, bras fléchis.',
    'Tends les bras jusqu’à l’extension complète, puis reviens lentement.',
    'Règle le siège pour que les coudes soient alignés avec l’axe de rotation de la machine.',
  ],
  96: [
    'Genoux ou pieds sur la plateforme de la machine d’assistance, mains sur les barres parallèles, bras tendus.',
    'Descends en fléchissant les coudes jusqu’à environ 90°, puis pousse jusqu’à bras tendus.',
    'Plus le contrepoids est lourd, plus l’exercice est facile. Réduis-le au fil des séances.',
  ],
  97: [
    'En position de pompe, mains rapprochées sous la poitrine, pouces et index formant un losange.',
    'Descends la poitrine vers les mains en gardant les coudes près du corps, puis pousse jusqu’à bras tendus.',
    'Corps gainé du début à la fin. Trop difficile : fais-les genoux au sol.',
  ],

  // Biceps (variantes)
  98: [
    'Debout, barre EZ tenue sur les parties inclinées, bras tendus, coudes près du corps.',
    'Monte la barre vers les épaules en fléchissant les coudes, puis redescends lentement.',
    'La barre EZ soulage les poignets par rapport à la barre droite. Évite de balancer le buste.',
  ],
  99: [
    'Assis au pupitre, arrière du bras à plat sur l’appui, haltère en main, bras presque tendu.',
    'Monte l’haltère vers l’épaule, puis redescends lentement sans verrouiller le coude en bas.',
    'Un bras à la fois pour bien sentir la contraction. Contrôle la descente, c’est là que le coude est exposé.',
  ],
  100: [
    'Assis, bras à plat sur l’appui, poignées en main, coudes alignés avec l’axe de la machine.',
    'Fléchis les coudes pour monter les poignées, puis redescends lentement.',
    'Règle le siège pour que les aisselles touchent le haut de l’appui.',
  ],
  101: [
    'Face à la poulie basse, corde en main, paumes face à face, bras tendus, coudes près du corps.',
    'Monte la corde vers les épaules en gardant la prise neutre, puis redescends lentement.',
    'Travaille aussi le brachial et les avant-bras. Les coudes ne doivent pas avancer.',
  ],
  102: [
    'Face à la poulie basse, poignée simple en supination, bras tendu, coude près du corps.',
    'Monte la poignée vers l’épaule, marque une pause, puis redescends lentement.',
    'Un bras à la fois pour corriger les déséquilibres. Le buste reste immobile.',
  ],
  103: [
    'Entre les deux poulies hautes d’un vis-à-vis, une poignée dans chaque main, bras tendus à hauteur d’épaules.',
    'Fléchis les coudes pour amener les poignées vers les oreilles, puis tends les bras lentement.',
    'Les bras restent à l’horizontale pendant tout le mouvement : seuls les avant-bras bougent.',
  ],
  104: [
    'Debout, barre tenue en pronation (paumes vers le sol), bras tendus, coudes près du corps.',
    'Monte la barre vers les épaules en fléchissant les coudes, puis redescends lentement.',
    'Cible les avant-bras et le brachial. Charge nettement plus légère qu’un curl classique.',
  ],

  // Avant-bras (variantes)
  105: [
    'Assis, avant-bras posés sur les cuisses, barre tenue en pronation, poignets dans le vide.',
    'Relève les poignets le plus haut possible, puis redescends lentement.',
    'Charge légère et amplitude complète : les extenseurs du poignet sont peu puissants.',
  ],

  // Dos (variantes)
  106: [
    'Assis, cuisses calées, barre tenue en supination largeur d’épaules, bras tendus.',
    'Tire la barre vers le haut de la poitrine en abaissant les coudes le long du corps, puis remonte contrôlé.',
    'Les biceps participent davantage qu’en pronation. Garde la poitrine haute sans te pencher en arrière.',
  ],
  107: [
    'Assis ou à genoux face à la poulie haute, poignée simple en main, bras tendu au-dessus de la tête.',
    'Tire la poignée vers l’épaule en abaissant le coude le long du corps, puis remonte lentement jusqu’à l’étirement.',
    'Permet une grande amplitude et corrige les déséquilibres entre les deux côtés.',
  ],
  108: [
    'Assis, cuisses calées sous les boudins, poignées en main, bras tendus.',
    'Tire les poignées vers le bas en abaissant les coudes vers les côtes, puis remonte contrôlé.',
    'Initie le mouvement en abaissant les épaules, pas en tirant avec les bras.',
  ],
  109: [
    'Assis ou debout face à la poulie, poignée simple en main, bras tendu, buste droit.',
    'Tire la poignée vers la hanche en gardant le coude près du corps, puis reviens lentement jusqu’à l’étirement.',
    'Laisse l’épaule avancer en fin de retour pour étirer le dos, sans tourner le buste.',
  ],
  110: [
    'Assis à la poulie, barre large tenue en pronation, bras tendus, buste droit.',
    'Tire la barre vers le bas de la poitrine en écartant les coudes, puis reviens lentement.',
    'Cible le haut du dos et l’arrière des épaules. Serre les omoplates en fin de tirage.',
  ],
  111: [
    'Buste parallèle au sol, dos neutre, barre posée au sol sous les épaules, prise en pronation.',
    'Tire la barre de façon explosive jusqu’au bas de la poitrine, puis repose-la au sol à chaque répétition.',
    'Le buste ne remonte pas pendant le tirage. Le repos au sol permet de repartir d’une position propre.',
  ],
  112: [
    'Debout, buste penché à environ 45°, dos neutre, barre tenue en supination largeur d’épaules.',
    'Tire la barre vers le nombril en gardant les coudes près du corps, puis redescends contrôlé.',
    'Sollicite davantage les biceps et le bas des dorsaux que la prise en pronation.',
  ],
  113: [
    'Allongé sur le ventre sur un banc incliné, un haltère dans chaque main, bras tendus vers le sol.',
    'Tire les haltères vers les hanches en serrant les omoplates, puis redescends lentement.',
    'L’appui supprime l’élan et soulage le bas du dos.',
  ],
  114: [
    'Suspendu aux poignées parallèles, paumes face à face, bras tendus.',
    'Tire en abaissant les coudes vers les côtes jusqu’à passer le menton au-dessus des poignées, puis redescends contrôlé.',
    'La prise neutre est la plus confortable pour les épaules et les coudes.',
  ],
  115: [
    'Genoux sur la plateforme de la machine d’assistance, mains sur la barre en pronation, bras tendus.',
    'Tire jusqu’à passer le menton au-dessus de la barre, puis redescends contrôlé jusqu’aux bras tendus.',
    'Plus le contrepoids est lourd, plus l’exercice est facile. Réduis-le au fil des séances.',
  ],
  116: [
    'Allongé sous une barre fixée à hauteur de hanches, mains en pronation, corps tendu, talons au sol.',
    'Tire la poitrine vers la barre en serrant les omoplates, puis redescends jusqu’aux bras tendus.',
    'Corps gainé et aligné. Plus les pieds sont avancés, plus c’est difficile.',
  ],
  117: [
    'Debout, barre tenue devant les cuisses, bras tendus, prise largeur d’épaules.',
    'Monte les épaules vers les oreilles, marque une pause, puis redescends lentement.',
    'Ne roule pas les épaules : le mouvement est vertical. Les bras ne fléchissent pas.',
  ],
  118: [
    'Barre posée sur les trapèzes, pieds largeur de hanches, genoux légèrement fléchis.',
    'Penche le buste en avant en reculant les hanches, dos neutre, jusqu’à sentir l’étirement des ischios, puis remonte.',
    'Commence très léger : le dos doit rester neutre tout du long.',
  ],
  119: [
    'Barre posée sur les sécurités du rack, juste sous ou au-dessus des genoux. Prise comme au soulevé de terre.',
    'Gaine-toi et tire la barre en poussant les hanches vers l’avant jusqu’à être debout, puis repose-la contrôlé.',
    'Permet de charger plus lourd que le soulevé de terre : garde le dos neutre et ne te penche pas en arrière.',
  ],

  // Épaules (variantes)
  120: [
    'Assis, épaules alignées avec l’axe de la machine, avant-bras ou mains contre les appuis.',
    'Monte les bras sur les côtés jusqu’à hauteur d’épaules, puis redescends lentement.',
    'Ne hausse pas les épaules : ce sont les deltoïdes qui travaillent, pas les trapèzes.',
  ],
  121: [
    'Dos à la poulie basse, poignée ou corde passée entre les jambes, bras tendus.',
    'Monte les bras devant toi jusqu’à hauteur d’épaules, puis redescends lentement.',
    'Coudes légèrement fléchis et buste immobile, sans élan.',
  ],
  122: [
    'Debout, un disque tenu à deux mains devant les cuisses, bras tendus.',
    'Monte le disque devant toi jusqu’à hauteur d’yeux, puis redescends lentement.',
    'Garde les côtes basses et le bas du dos neutre, sans balancer.',
  ],
  123: [
    'Entre les deux poulies d’un vis-à-vis réglées à hauteur d’épaules, câbles croisés : main droite sur la poulie gauche et inversement.',
    'Écarte les bras vers l’arrière, coudes légèrement fléchis, jusqu’à l’alignement avec les épaules, puis reviens lentement.',
    'Cible l’arrière des épaules. Charge légère, sans serrer exagérément les omoplates.',
  ],
  124: [
    'Debout, barre tenue devant les cuisses en pronation, prise largeur d’épaules.',
    'Tire la barre le long du corps jusqu’au bas de la poitrine en menant avec les coudes, puis redescends lentement.',
    'Ne monte pas les coudes au-dessus des épaules : une prise plus large ménage les épaules.',
  ],

  // Jambes (variantes)
  125: [
    'Barre guidée posée sur les trapèzes, pieds légèrement avancés, écartés largeur d’épaules.',
    'Descends en fléchissant les genoux jusqu’à ce que les cuisses soient parallèles au sol, puis remonte.',
    'Mets les sécurités à la bonne hauteur. Genoux dans l’axe des pieds, talons au sol.',
  ],
  126: [
    'Barre posée sur les trapèzes, debout, pieds largeur de hanches.',
    'Fais un grand pas en avant et descends jusqu’à ce que le genou arrière frôle le sol, puis reviens et change de jambe.',
    'Buste droit. Plus délicat en équilibre qu’avec des haltères : commence léger.',
  ],
  127: [
    'Debout, un haltère dans chaque main, bras le long du corps.',
    'Avance d’un grand pas et descends jusqu’à ce que le genou arrière frôle le sol, puis enchaîne avec l’autre jambe en avançant.',
    'Compte une répétition par jambe. Le genou avant reste dans l’axe du pied.',
  ],
  128: [
    'Debout, un haltère dans chaque main, pieds largeur de hanches.',
    'Recule une jambe d’un grand pas et descends jusqu’à ce que le genou arrière frôle le sol, puis reviens en poussant sur le talon avant.',
    'Plus douce pour les genoux que la fente avant. Le poids reste sur la jambe avant.',
  ],
  129: [
    'Face à un banc ou une box à hauteur de genou, un haltère dans chaque main.',
    'Pose un pied entier sur le banc et monte en poussant sur ce talon, puis redescends contrôlé. Enchaîne les répétitions puis change de jambe.',
    'Ne pousse pas avec la jambe restée au sol : c’est la jambe sur le banc qui fait le travail.',
  ],
  130: [
    'Debout face à la machine, cuisse contre l’appui, boudin derrière la cheville.',
    'Fléchis le genou pour monter le talon vers les fesses, puis redescends lentement.',
    'Une jambe à la fois. Le bassin reste plaqué contre l’appui.',
  ],
  131: [
    'Debout, un haltère dans chaque main devant les cuisses, genoux légèrement fléchis.',
    'Descends les haltères le long des jambes en reculant les hanches, dos neutre, jusqu’à sentir l’étirement des ischios, puis remonte.',
    'Les genoux restent fixes, c’est la hanche qui bouge. Le dos ne s’arrondit pas.',
  ],
  132: [
    'Assis dans la machine, haut du dos contre l’appui, ceinture ou coussin sur les hanches, pieds à plat.',
    'Monte le bassin jusqu’à aligner épaules, hanches et genoux en serrant les fessiers, puis redescends.',
    'Garde le menton rentré et les côtes basses : ne cambre pas en haut.',
  ],
  133: [
    'Allongé sur le dos, genoux fléchis, pieds à plat au sol largeur de hanches.',
    'Monte le bassin en poussant dans les talons jusqu’à aligner épaules, hanches et genoux, puis redescends.',
    'Serre les fessiers en haut. Ajoute un disque ou un haltère sur les hanches pour corser.',
  ],
  134: [
    'Dos à la poulie basse, corde passée entre les jambes, pieds un peu plus larges que les hanches.',
    'Recule les hanches en laissant la corde passer entre les jambes, dos neutre, puis pousse les hanches vers l’avant pour te redresser.',
    'Les bras ne tirent pas : c’est l’extension de hanche qui ramène la corde.',
  ],
  135: [
    'De profil à la poulie basse, sangle à la cheville extérieure, main en appui pour l’équilibre.',
    'Écarte la jambe sur le côté, jambe tendue, puis reviens lentement.',
    'Mouvement court et contrôlé : le buste ne se penche pas.',
  ],
  136: [
    'Assis à la presse à cuisses, avant des pieds sur le bas du plateau, jambes tendues sans verrouiller.',
    'Pousse le plateau avec la pointe des pieds le plus loin possible, puis reviens lentement jusqu’à l’étirement.',
    'Garde les sécurités engagées : le plateau ne doit pas glisser des pieds.',
  ],
  137: [
    'À genoux sur un tapis, chevilles bloquées sous un appui ou tenues par un partenaire, corps droit.',
    'Penche-toi en avant le plus lentement possible en gardant hanches et genoux alignés, puis amortis avec les mains et remonte.',
    'Exercice très exigeant : la descente lente suffit au début.',
  ],
  138: [
    'Debout, pieds un peu plus larges que les hanches, kettlebell tenu à deux mains devant toi.',
    'Fais passer le kettlebell entre les jambes en reculant les hanches, puis projette-le jusqu’à hauteur de poitrine par une extension de hanches explosive.',
    'Ce sont les hanches qui donnent l’élan, pas les bras ni les épaules. Dos neutre tout du long.',
  ],

  // Abdominaux (variantes)
  139: [
    'Allongé sur le dos, bras le long du corps, genoux fléchis à 90°, pieds décollés.',
    'Enroule le bassin pour ramener les genoux vers la poitrine en décollant les fesses, puis redescends lentement.',
    'Pas d’élan : c’est le bassin qui s’enroule, pas les jambes qui se balancent.',
  ],
  140: [
    'Allongé sur le dos, jambes tendues, mains sous les fesses ou le long du corps.',
    'Monte les jambes jusqu’à la verticale, puis redescends lentement sans toucher le sol.',
    'Le bas du dos reste plaqué au sol. Plie les genoux pour faciliter.',
  ],
  141: [
    'Avant-bras sur les appuis, dos contre le dossier, jambes pendantes.',
    'Monte les genoux vers la poitrine en enroulant le bassin, puis redescends lentement.',
    'Plus accessible que suspendu. Jambes tendues pour corser.',
  ],
  142: [
    'Assis, poignées ou appuis en main, pieds calés.',
    'Enroule le buste vers les genoux en contractant les abdos, puis reviens lentement.',
    'Ce sont les abdos qui tirent, pas les bras. Expire en enroulant.',
  ],
  143: [
    'De profil à la poulie réglée haute, poignée tenue à deux mains, bras tendus, pieds écartés.',
    'Tire la poignée en diagonale vers la hanche opposée en tournant le buste, puis reviens lentement.',
    'La rotation vient du tronc, les bras restent tendus. Fais les deux côtés.',
  ],
  144: [
    'De profil à la poulie réglée à hauteur de poitrine, poignée tenue à deux mains contre le sternum.',
    'Tends les bras devant toi sans laisser le buste tourner, tiens une seconde, puis ramène la poignée.',
    'Exercice d’anti-rotation : le buste reste immobile. Fais les deux côtés.',
  ],

  // Dos (compléments)
  145: [
    'Debout au centre de la trap bar, pieds largeur de hanches, poignées saisies de chaque côté.',
    'Gaine-toi, puis pousse dans le sol pour te redresser jusqu’à être debout hanches verrouillées. Redescends en reculant les hanches et en fléchissant les genoux.',
    'La charge alignée avec le corps soulage le bas du dos : plus accessible que le soulevé de terre classique.',
  ],
  146: [
    'Assis, haut du dos contre l’appui, pieds calés, bassin bien plaqué au siège.',
    'Pousse l’appui vers l’arrière en étendant le buste, puis reviens lentement.',
    'Amplitude contrôlée, sans à-coups : le mouvement s’arrête quand le buste est aligné avec les cuisses.',
  ],

  // Épaules (compléments)
  147: [
    'Assis sur un banc à dossier vertical, barre devant les épaules, prise un peu plus large que les épaules.',
    'Pousse la barre à la verticale au-dessus de la tête jusqu’à bras tendus, puis redescends aux épaules.',
    'Le dossier limite la cambrure : garde le dos plaqué contre lui.',
  ],
  148: [
    'Assis sous la barre guidée, banc à dossier vertical, barre à hauteur du menton.',
    'Déverrouille la barre, pousse-la au-dessus de la tête jusqu’à bras tendus, puis redescends au menton.',
    'Place le banc pour que la barre passe juste devant le visage.',
  ],
  149: [
    'Debout ou à genoux, extrémité de la barre (calée dans un coin ou un landmine) tenue d’une main à hauteur d’épaule.',
    'Pousse la barre vers le haut et l’avant jusqu’à bras tendu, puis redescends à l’épaule. Change de côté.',
    'La trajectoire en arc est douce pour les épaules. Garde le buste gainé, sans pencher.',
  ],
  150: [
    'De profil à la poulie réglée à hauteur de coude, poignée tenue par la main la plus éloignée, coude collé au corps et fléchi à 90°.',
    'Tourne l’avant-bras vers l’extérieur en gardant le coude contre le corps, puis reviens lentement.',
    'Travail de la coiffe des rotateurs : charge très légère, idéal en échauffement.',
  ],

  // Biceps (compléments)
  151: [
    'Allongé sur le ventre sur un banc incliné, barre EZ tenue bras tendus vers le sol.',
    'Monte la barre vers les épaules en fléchissant les coudes, puis redescends lentement.',
    'Les bras restent verticaux : impossible de tricher avec l’élan.',
  ],
  152: [
    'Dos à la poulie basse, poignée simple en main, un pied devant, bras tiré vers l’arrière.',
    'Fléchis le coude pour monter la poignée vers l’épaule sans avancer le bras, puis redescends lentement.',
    'Le bras en arrière étire le biceps au départ du mouvement. Un bras à la fois.',
  ],
  153: [
    'Debout, un haltère dans chaque main, bras tendus, paumes vers l’avant.',
    'Monte en supination, tourne les poignets en pronation en haut, puis redescends lentement paumes vers le sol.',
    'La descente en pronation travaille les avant-bras : prends une charge que tu contrôles en descente.',
  ],

  // Triceps (compléments)
  154: [
    'Assis, poignées de chaque côté du corps, coudes fléchis, dos contre le dossier.',
    'Pousse les poignées vers le bas jusqu’à bras tendus, puis remonte lentement.',
    'Garde les épaules basses et les coudes près du corps.',
  ],

  // Avant-bras (compléments)
  155: [
    'Debout, rouleau tenu bras tendus devant toi, poids suspendu à la corde.',
    'Enroule la corde en tournant les poignets jusqu’à remonter le poids, puis déroule lentement.',
    'Les bras restent tendus et immobiles : ce sont les poignets qui travaillent.',
  ],
  156: [
    'Suspendu à la barre de traction, prise en pronation largeur d’épaules, bras tendus.',
    'Tiens la position le plus longtemps possible, épaules légèrement engagées.',
    'Travaille la poigne et décompresse le dos. Ajoute du poids quand tu tiens une minute.',
  ],

  // Jambes (compléments)
  157: [
    'Dos contre l’appui, épaules sous les boudins, pieds au milieu de la plateforme.',
    'Descends en fléchissant les genoux aussi bas que possible, puis remonte en poussant sur toute la plante des pieds.',
    'La trajectoire guidée permet de descendre profond en ménageant le dos.',
  ],
  158: [
    'Assis, dos contre le dossier, pieds sur la plateforme largeur de hanches.',
    'Pousse jusqu’à jambes presque tendues, puis reviens en fléchissant les genoux jusqu’à environ 90°.',
    'Ne verrouille pas les genoux en fin de poussée et garde le bas du dos contre le dossier.',
  ],
  159: [
    'Debout, une main sur un appui, pieds largeur de hanches, sur la pointe des pieds.',
    'Fléchis les genoux en les avançant et en penchant le corps en arrière, hanches tendues, puis remonte.',
    'Cible le quadriceps en étirement. Commence avec une petite amplitude pour habituer les genoux.',
  ],
  160: [
    'Debout, pieds bien écartés, pointes vers l’extérieur, un haltère tenu à deux mains entre les jambes.',
    'Descends en fléchissant les genoux dans l’axe des pieds, buste droit, puis remonte en poussant dans les talons.',
    'L’écartement sollicite davantage les adducteurs et les fessiers.',
  ],
  161: [
    'Debout sur une jambe, genou légèrement fléchi, haltère dans la main opposée.',
    'Penche le buste en avant en levant la jambe libre derrière toi, dos neutre, jusqu’à sentir l’étirement de l’ischio, puis remonte.',
    'Hanches parallèles au sol, sans ouvrir le bassin. Aide-toi d’un appui pour l’équilibre au début.',
  ],
  162: [
    'Genoux sur le coussin du banc GHD, chevilles calées, corps droit à l’horizontale.',
    'Fléchis les genoux pour remonter le buste jusqu’à la verticale, puis redescends lentement.',
    'Hanches tendues tout du long. Aide-toi des mains en bas tant que tu ne remontes pas seul.',
  ],
  163: [
    'Buste en appui sur la machine, un pied contre la plateforme ou le levier.',
    'Pousse la jambe vers l’arrière et le haut en contractant le fessier, puis reviens lentement.',
    'Ne cambre pas en fin de poussée : c’est la hanche qui s’étend, pas le bas du dos.',
  ],
  164: [
    'De profil à la poulie basse, sangle à la cheville la plus proche, main en appui pour l’équilibre.',
    'Ramène la jambe devant l’autre en la croisant légèrement, puis reviens lentement.',
    'Mouvement contrôlé, buste droit.',
  ],
  165: [
    'Sous la barre guidée posée sur les trapèzes, avant des pieds sur une cale, talons dans le vide.',
    'Monte sur la pointe des pieds le plus haut possible, puis descends lentement sous le niveau de la cale.',
    'Marque une pause en haut et en bas, sans rebond.',
  ],
  166: [
    'Debout sur une marche sur un pied, haltère dans la main du même côté, l’autre main en appui.',
    'Monte sur la pointe du pied le plus haut possible, puis descends lentement sous le niveau de la marche.',
    'Une jambe à la fois corrige les déséquilibres. Amplitude complète.',
  ],

  // Abdominaux (compléments)
  167: [
    'Debout, un haltère dans une main, bras le long du corps, l’autre main sur la hanche.',
    'Penche le buste du côté de l’haltère, puis remonte en contractant les obliques opposés. Change de côté.',
    'Le buste reste de face, sans tourner ni pencher en avant.',
  ],
  168: [
    'Allongé sur le dos, bras tendus vers le plafond, genoux fléchis à 90° au-dessus des hanches.',
    'Étends un bras derrière la tête et la jambe opposée vers le sol, puis reviens et change de côté.',
    'Le bas du dos reste plaqué au sol. Mouvement lent et contrôlé.',
  ],
  169: [
    'Allongé sur le dos, mains derrière la tête, jambes décollées, genoux fléchis.',
    'Amène un coude vers le genou opposé en tendant l’autre jambe, puis alterne.',
    'C’est le buste qui tourne, pas les coudes qui tirent sur la nuque.',
  ],
  170: [
    'Sur un banc décliné, pieds calés, buste allongé, bras croisés sur la poitrine.',
    'Enroule le buste jusqu’à la verticale, puis redescends lentement.',
    'Plus l’inclinaison est forte, plus c’est difficile. Tiens un disque pour corser.',
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
