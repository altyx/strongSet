# my-fitness

Monorepo de l'application my-fitness, géré avec les [workspaces npm](https://docs.npmjs.com/cli/using-npm/workspaces).

## Structure

```
apps/
  mobile/     Application mobile Expo (iOS / Android)
packages/     Code partagé entre les apps (à venir)
```

## Démarrer

Toutes les commandes se lancent depuis la racine du repo.

```bash
npm install          # installe les dépendances de tous les workspaces
npm start            # démarre Metro pour l'app mobile (alias de npm run mobile)
npm run ios          # compile et lance l'app sur le simulateur iOS (alias de npm run mobile:ios)
npm run android      # idem sur l'émulateur Android (alias de npm run mobile:android)
npm run lint         # lint de tous les workspaces
```

Pour passer des options à Expo : `npm run ios -- --device "<nom ou UDID>" --port 8082`.
Pour lancer une commande dans un workspace précis : `npm run <script> -w @my-fitness/mobile`.
Pour ajouter une dépendance à l'app mobile : `npx expo install <paquet>` depuis `apps/mobile`.

## Pièges connus

- **Ne pas lancer `npx expo …` à la racine** : Expo y prendrait la racine du repo pour le projet. Passer par les scripts npm ci-dessus, ou lancer `npx expo …` depuis `apps/mobile`.
- **Après un `git pull` qui touche aux dépendances ou au passage en monorepo**, régénérer le natif : `npx expo prebuild --clean` dans `apps/mobile` (ou au minimum `pod install` dans `apps/mobile/ios`, avec `LANG=en_US.UTF-8`).
- **Plusieurs simulateurs démarrés avec le même nom** (ex. deux « iPhone 17 Pro ») : préciser l'UDID avec `--device`, ou n'en garder qu'un seul démarré.
