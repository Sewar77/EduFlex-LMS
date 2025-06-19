import { query } from "../config/db.js"; // Adjust this import according to your setup

export async function markLessonComplete(user_id, lesson_id) {
  const existing = await query(
    `SELECT 1 FROM lesson_completions WHERE user_id = $1 AND lesson_id = $2`,
    [user_id, lesson_id]
  );

  if (existing.rows.length > 0) return true;

  await query(
    `INSERT INTO lesson_completions (user_id, lesson_id) VALUES ($1, $2)`,
    [user_id, lesson_id]
  );

  return false;
}

export async function isLessonCompleted(user_id, lesson_id) {
  try {
    const result = await query(
      `SELECT 1 FROM lesson_completions WHERE user_id = $1 AND lesson_id = $2`,
      [user_id, lesson_id]
    );
    return result.rowCount > 0;
  } catch (err) {
    throw err;
  }
}
