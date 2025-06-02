import { query } from "../config/db.js";

// Create assignment
export async function createAssignment(assignmentInfo) {
  try {
    const result = await query(
      `
        INSERT INTO assignments (title, description, deadline, lesson_id, max_score)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [
        assignmentInfo.title,
        assignmentInfo.description,
        assignmentInfo.deadline,
        assignmentInfo.lesson_id,
        assignmentInfo.max_score,
      ]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Get assignment by ID
export async function getAssignmentById(assignment_id) {
  if (!Number.isInteger(assignment_id)) {
    throw new Error("Invalid assignment ID");
  }
  try {
    const result = await query(
      `
        SELECT id, title, description, deadline, lesson_id, max_score
        FROM assignments
        WHERE id = $1
      `,
      [assignment_id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Get all assignments for a lesson
export async function getAllAssignmentsForLesson(lesson_id) {
  if (!Number.isInteger(lesson_id)) {
    throw new Error("Invalid lesson ID");
  }
  try {
    const result = await query(
      `
        SELECT id,title, description, deadline, lesson_id, max_score
        FROM assignments
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

// Update assignment
export async function updateAssignment(assignmentInfo) {
  if (!Number.isInteger(assignmentInfo.id)) {
    throw new Error("Invalid assignment ID");
  }
  try {
    const result = await query(
      `
        UPDATE assignments
        SET title = $1,
            description = $2,
            deadline = $3,
            lesson_id = $4,
            max_score = $5
        WHERE id = $6
        RETURNING *
      `,
      [
        assignmentInfo.title,
        assignmentInfo.description,
        assignmentInfo.deadline,
        assignmentInfo.lesson_id,
        assignmentInfo.max_score,
        assignmentInfo.id,
      ]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Delete assignment
export async function deleteAssignment(assignment_id) {
  if (!Number.isInteger(assignment_id)) {
    throw new Error("Invalid assignment ID");
  }
  try {
    const result = await query(
      `
        DELETE FROM assignments
        WHERE id = $1
        RETURNING *
      `,
      [assignment_id]
    );
    return !!result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
}
