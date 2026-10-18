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
npm run mobile       # démarre Metro pour l'app mobile
npm run mobile:ios   # compile et lance l'app sur le simulateur iOS
npm run lint         # lint de tous les workspaces
```

Pour lancer une commande dans un workspace précis : `npm run <script> -w @my-fitness/mobile`.
Pour ajouter une dépendance à l'app mobile : `npx expo install <paquet>` depuis `apps/mobile`.
