import { palette } from '@/src/constants/theme';
import { SetType } from '@/src/repositories/workout/workout-type';

type SetTypeInfo = {
  label: string;
  // Lettre affichée à la place du numéro de série ; null = numéro
  letter: string | null;
  // null = couleur de série normale
  color: string | null;
  description: string;
};

// Ordre d'affichage dans le choix du type
export const SET_TYPES: SetType[] = ['normal', 'warmup', 'drop', 'failure'];

export const SET_TYPE_INFO: Record<SetType, SetTypeInfo> = {
  normal: { label: 'Normale', letter: null, color: null, description: 'Série de travail' },
  warmup: {
    label: 'Échauffement',
    letter: 'É',
    color: palette.warmup,
    description: 'Hors volume, records et progression',
  },
  drop: { label: 'Dégressive', letter: null, color: palette.run, description: 'Charge réduite juste après une série' },
  failure: { label: 'À l’échec', letter: null, color: palette.danger, description: 'Jusqu’à ne plus pouvoir faire de répétition' },
};

/**
 * Libellé de chaque série dans le badge : « É » pour l'échauffement, sinon son numéro parmi les séries de travail
 * (l'échauffement ne décale pas la numérotation).
 */
export function setLabels(types: SetType[]): string[] {
  let number = 0;
  return types.map((type) => SET_TYPE_INFO[type].letter ?? String(++number));
}
