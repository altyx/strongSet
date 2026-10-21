# StrongSet — app mobile

Application Expo (iOS / Android). Identifiant : `com.altyx.strongset` sur les deux plateformes. Les commandes de développement sont décrites dans le [README à la racine](../../README.md).

## Publier une version

Les builds de store passent par [EAS](https://docs.expo.dev/build/introduction/). Profils dans `eas.json` :

| Profil | Usage |
| --- | --- |
| `development` | Dev client pour le simulateur iOS |
| `preview` | Build interne à installer sur un téléphone (APK pour Android) |
| `production` | Build des stores ; le numéro de build est incrémenté par EAS (`appVersionSource: remote`) |

### Une seule fois

1. Compléter l'éditeur et son contact dans `src/constants/legal.ts` (`LEGAL_EDITOR`). Tant que c'est vide, les CGU et la politique de confidentialité affichent « [à compléter] ».
2. Mettre la politique de confidentialité en ligne : App Store Connect et Google Play demandent une URL publique. Le texte est le même que dans l'app (`PRIVACY` dans `src/constants/legal.ts`).
3. Se connecter à Expo et lier le projet (ajoute `extra.eas.projectId` dans `app.json`) :

   ```bash
   npx eas-cli login
   npx eas-cli init
   ```

4. Créer les fiches de l'app sur App Store Connect et la Google Play Console, avec les captures d'écran.
5. Déclarer la confidentialité : aucune donnée collectée (« Data Not Collected » sur l'App Store, section « Sécurité des données » vide sur Google Play).

### À chaque version

1. Augmenter `version` dans `app.json` (ex. `1.0.1`).
2. Si le schéma SQLite change, ajouter une migration dans `src/db/migrations.ts` : **dès la première publication, le schéma v1 est figé**.
3. Construire et envoyer :

   ```bash
   npx eas-cli build --platform all --profile production
   npx eas-cli submit --platform all --profile production
   ```
