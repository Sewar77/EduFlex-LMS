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
export async function getLessonById(lesson_id) {
  if (!Number.isInteger(lesson_id)) {
    throw new Error("Invalid Lesson Id");
  }

  try {
    // 1. Get current lesson
    const lessonResult = await query(
      `SELECT id, title, duration, "order", content_url, is_free, content_type, module_id
       FROM lessons
       WHERE id = $1`,
      [lesson_id]
    );

    const lesson = lessonResult.rows[0];
    if (!lesson) return null;

    // 2. Get next lesson
    const nextResult = await query(
      `SELECT id FROM lessons
       WHERE module_id = $1 AND "order" > $2
       ORDER BY "order" ASC LIMIT 1`,
      [lesson.module_id, lesson.order]
    );

    // 3. Get previous lesson
    const prevResult = await query(
      `SELECT id FROM lessons
       WHERE module_id = $1 AND "order" < $2
       ORDER BY "order" DESC LIMIT 1`,
      [lesson.module_id, lesson.order]
    );

    // 4. Attach navigation IDs
    return {
      ...lesson,
      nextLessonId: nextResult.rows[0]?.id || null,
      prevLessonId: prevResult.rows[0]?.id || null,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}



// Get full content for a lesson by its content_type
export async function getLessonContent(lesson) {
  const { content_type, content_url } = lesson;

  switch (content_type) {
    case "text":
      return { type: "text", content: content_url };

    case "video":
      return { type: "video", url: content_url };

    case "quiz": {
      const quizId = Number(content_url); // Assuming content_url is quizId
      const result = await query(
        "SELECT id, question, options FROM quizzes WHERE lesson_id = $1",
        [lesson.id]
      );
      return { type: "quiz", questions: result.rows };
    }

    case "assignment": {
      const result = await query(
        "SELECT id, title, description, due_date FROM assignments WHERE lesson_id = $1",
        [lesson.id]
      );
      return { type: "assignment", ...result.rows[0] };
    }

    default:
      return null;
  }
}



















