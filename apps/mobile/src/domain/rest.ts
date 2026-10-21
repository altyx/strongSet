// Repos en cours entre deux séries, conservé quand l'écran de séance est réduit ou l'app fermée
export interface ActiveRest {
  // Séance à laquelle le repos appartient
  workoutId: number;
  // Fin du repos, en millisecondes (Date.now())
  endsAt: number;
  // Durée totale en secondes, pour la barre de progression
  duration: number;
}

/**
 * Repos enregistré à reprendre en rouvrant la séance : seulement s'il appartient à cette séance et n'est pas fini.
 * @returns null sinon (repos d'une autre séance, terminé pendant l'absence, ou donnée illisible)
 */
export function restToResume(stored: unknown, workoutId: number, now: number): ActiveRest | null {
  if (typeof stored !== 'object' || stored === null) {
    return null;
  }
  const rest = stored as Partial<ActiveRest>;
  if (
    rest.workoutId !== workoutId ||
    typeof rest.endsAt !== 'number' ||
    typeof rest.duration !== 'number' ||
    rest.endsAt <= now
  ) {
    return null;
  }
  return { workoutId, endsAt: rest.endsAt, duration: rest.duration };
}
