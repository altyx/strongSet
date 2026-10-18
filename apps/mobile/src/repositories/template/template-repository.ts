import {Template} from "@/src/repositories/template/template-type";
import {getDatabase} from "@/src/db/database";

export const TemplateRepository = {
  getAllTemplates: (): Template[] => {
    const db = getDatabase();
    const rows = db.getAllSync<any>(`
      SELECT 
        t.id as template_id,
        t.name as template_name,
        t.created_at as template_created_at,
        t.updated_at as template_updated_at,
        te.id as template_exercise_id,
        te.note as template_exercise_note,
        e.id as exercise_id,
        e.name as exercise_name,
        e.equipment,
        e.note as exercise_note
      FROM templates t
      LEFT JOIN template_exercises te ON t.id = te.template_id
      LEFT JOIN exercises e ON te.exercise_id = e.id
      ORDER BY t.created_at DESC, te.id ASC
    `);

    const templatesMap = new Map<number, any>();

    rows.forEach((row: any) => {
      const templateId = row.template_id;

      if (!templatesMap.has(templateId)) {
        templatesMap.set(templateId, {
          id: row.template_id,
          name: row.template_name,
          created_at: row.template_created_at,
          updated_at: row.template_updated_at,
          exercises: []
        });
      }

      if (row.exercise_id) {
        templatesMap.get(templateId).exercises.push({
          id: row.exercise_id,
          name: row.exercise_name,
          primary_focus: row.primary_focus,
          secondary_focus: row.secondary_focus,
          equipment: row.equipment,
          note: row.exercise_note,
          template_exercise_note: row.template_exercise_note
        });
      }
    });

    return Array.from(templatesMap.values());
  }
}
