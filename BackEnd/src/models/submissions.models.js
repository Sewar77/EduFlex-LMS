import { query } from "../config/db.js";

// Create submission
export async function createSubmission(submissionInfo) {
  try {
    const result = await query(
      `
        INSERT INTO submissions (assignment_id, user_id, submission_url, grade, feedback)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [
        submissionInfo.assignment_id,
        submissionInfo.user_id,
        submissionInfo.submission_url,
        submissionInfo.grade ?? null,
        submissionInfo.feedback ?? null,
      ]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Get submission by ID
export async function getSubmissionById(submission_id) {
  if (!Number.isInteger(submission_id)) {
    throw new Error("Invalid submission ID");
  }
  try {
    const result = await query(
      `
        SELECT *
        FROM submissions
        WHERE id = $1
      `,
      [submission_id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Get all submissions for an assignment
export async function getAllSubmissionsForAssignment(assignment_id) {
  if (!Number.isInteger(assignment_id)) {
    throw new Error("Invalid assignment ID");
  }
  try {
    const result = await query(
      `
        SELECT *
        FROM submissions
        WHERE assignment_id = $1
      `,
      [assignment_id]
    );
    return result.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Update submission (grade/feedback)
export async function updateSubmission(submissionInfo) {
  if (!Number.isInteger(submissionInfo.id)) {
    throw new Error("Invalid submission ID");
  }
  try {
    const result = await query(
      `
        UPDATE submissions
        SET grade = $1,
            feedback = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
      `,
      [submissionInfo.grade, submissionInfo.feedback, submissionInfo.id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Delete submission
export async function deleteSubmission(submission_id) {
  if (!Number.isInteger(submission_id)) {
    throw new Error("Invalid submission ID");
  }
  try {
    const result = await query(
      `
        DELETE FROM submissions
        WHERE id = $1
        RETURNING *
      `,
      [submission_id]
    );
    return !!result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
}
