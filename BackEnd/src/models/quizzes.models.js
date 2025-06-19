import { query } from "../config/db.js";

// Create quiz
export async function createQuiz(quizInfo) {
  try {
    const result = await query(
      `
        INSERT INTO quizzes (lesson_id, question, options, correct_answer, max_score)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [
        quizInfo.lesson_id,
        quizInfo.question,
        JSON.stringify(quizInfo.options),
        quizInfo.correct_answer,
        quizInfo.max_score ?? 10,
      ]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Get quiz by ID
export async function getQuizById(quiz_id) {
  if (!Number.isInteger(quiz_id)) {
    throw new Error("Invalid quiz ID");
  }
  try {
    const result = await query(
      `
        SELECT id, lesson_id, question, options, correct_answer, max_score, created_at, updated_at
        FROM quizzes
        WHERE id = $1
      `,
      [quiz_id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Get all quizzes for a lesson
export async function getAllQuizzesForLesson(lesson_id) {
  if (!Number.isInteger(lesson_id)) {
    throw new Error("Invalid lesson ID");
  }
  try {
    const result = await query(
      `
        SELECT id, lesson_id, question, options, correct_answer, max_score, created_at, updated_at
        FROM quizzes
        WHERE lesson_id = $1
      `,
      [lesson_id]
    );
    return result.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Update quiz
export async function updateQuiz(quizInfo) {
  if (!Number.isInteger(quizInfo.id)) {
    throw new Error("Invalid quiz ID");
  }
  try {
    const result = await query(
      `
        UPDATE quizzes
        SET lesson_id = $1,
            question = $2,
            options = $3,
            correct_answer = $4,
            max_score = $5,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING *
      `,
      [
        quizInfo.lesson_id,
        quizInfo.question,
        JSON.stringify(quizInfo.options),
        quizInfo.correct_answer,
        quizInfo.max_score ?? 10,
        quizInfo.id,
      ]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Delete quiz
export async function deleteQuiz(quiz_id) {
  if (!Number.isInteger(quiz_id)) {
    throw new Error("Invalid quiz ID");
  }
  try {
    const result = await query(
      `
        DELETE FROM quizzes
        WHERE id = $1
        RETURNING *
      `,
      [quiz_id]
      );
      
    return !!result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
}


export const calculateAndSaveAttempt = async (userId, lessonId, answers) => {
  const quizzesResult = await query(
    "SELECT id, correct_answer FROM quizzes WHERE lesson_id = $1",
    [lessonId]
  );

  if (quizzesResult.rowCount === 0) {
    throw new Error("No quizzes found for this lesson");
  }

  const quizzes = quizzesResult.rows;
  let score = 0;
  const correctAnswers = {};

  quizzes.forEach((q) => {
    correctAnswers[q.id] = q.correct_answer;
    if (answers[q.id] && answers[q.id] === q.correct_answer) {
      score += 10;
    }
  });

  const totalScore = quizzes.length * 10;

  await query(
    `INSERT INTO quiz_attempts 
     (user_id, lesson_id, answers, score, total_score, max_score, attempt_date)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
    [userId, lessonId, JSON.stringify(answers), score, totalScore, totalScore]
  );

  return { score, correctAnswers }; // ✅ Return both
};
