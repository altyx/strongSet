import {getDatabase} from "@/src/db/database";

export const ExerciseRepository = {
  count: (): number => {
    const row = getDatabase().getFirstSync<{ count: number }>('SELECT COUNT(*) AS count FROM exercises');
    return row?.count ?? 0;
  },
}
