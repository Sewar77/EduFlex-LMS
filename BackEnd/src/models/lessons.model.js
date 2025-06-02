import { query } from "../config/db.js";

//create
export async function createLesson(lessonInfo) {
  try {
    const result = await query(
      `
        insert into lessons
 (title, duration, "order", content_url, is_free, content_type, module_id)
        values($1, $2, $3, $4, $5, $6, $7) RETURNING *
`,
      [
        lessonInfo.title,
        lessonInfo.duration,
        lessonInfo.order,
        lessonInfo.content_url,
        lessonInfo.is_free,
        lessonInfo.content_type,
        lessonInfo.module_id,
      ]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//update
export async function updateLesson(lessonInfo) {
  if (!Number.isInteger(lessonInfo.id)) {
  throw new Error("Invalid id")
  }
  try {
    const result = await query(
      `
        update lessons
        set title = $1,
        duration = $2,
        "order"= $3,
        content_url= $4,
        is_free= $5,
        content_type= $6,
        module_id= $7
        WHERE id = $8
        RETURNING *
`,
      [
        lessonInfo.title,
        lessonInfo.duration,
        lessonInfo.order,
        lessonInfo.content_url,
        lessonInfo.is_free,
        lessonInfo.content_type,
        lessonInfo.module_id,
        lessonInfo.id,
      ]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//delete
export async function deleteLesson(lesson_id) {
  if (!Number.isInteger(lesson_id)) {
    throw new Error("Invalid Lesson Id");
  }
  try {
    const result = await query(`delete from lessons WHERE id = $1`, [
      lesson_id,
    ]);
    if (result.rowCount > 0) return true;
    return false;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//get Lessons for a module
export async function getAllLessonsForModule(module_id) {
  if (!Number.isInteger(module_id)) {
    throw new Error("Invalid module Id");
  }
  try {
    const result = await query(
      `
        select id, title, duration, "order", content_url, is_free, content_type, module_id
        from lessons
        WHERE module_id = $1`,
      [module_id]
    );
    return result.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//get lesson by ID
export async function getLessonById(lesson_id) {
  if (!Number.isInteger(lesson_id)) {
    throw new Error("Invalid Lesson Id");
  }
  try {
    const result = await query(
      `select id, title, duration, "order", content_url, is_free, content_type, module_id
        from lessons
        WHERE id = $1`,
      [lesson_id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}






























