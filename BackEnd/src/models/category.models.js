import { query } from "../config/db.js";

// Create category
export async function createCategory(categoryInfo) {
  try {
    const result = await query(
      `
        INSERT INTO categories (name)
        VALUES ($1)
        RETURNING *
      `,
      [categoryInfo.name]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Get all categories
export async function getAllCategories() {
  try {
    const result = await query(
      `
        SELECT id, name, created_at
        FROM categories
        ORDER BY created_at DESC
      `
    );
    return result.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Get category by ID
export async function getCategoryById(category_id) {
  if (!Number.isInteger(category_id)) {
    throw new Error("Invalid category ID");
  }
  try {
    const result = await query(
      `
        SELECT id, name, created_at
        FROM categories
        WHERE id = $1
      `,
      [category_id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Update category
export async function updateCategory(categoryInfo) {
  if (!Number.isInteger(categoryInfo.id)) {
    throw new Error("Invalid category ID");
  }
  try {
    const result = await query(
      `
        UPDATE categories
        SET name = $1
        WHERE id = $2
        RETURNING *
      `,
      [categoryInfo.name, categoryInfo.id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Delete category
export async function deleteCategory(category_id) {
  if (!Number.isInteger(category_id)) {
    throw new Error("Invalid category ID");
  }
  try {
    const result = await query(
      `
        DELETE FROM categories
        WHERE id = $1
        RETURNING *
      `,
      [category_id]
    );
    return !!result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
}



// Get all courses in a category
export async function getCoursesByCategoryId(category_id) {
  if (!Number.isInteger(category_id)) {
    throw new Error("Invalid category ID");
  }

  try {
    const result = await query(
      `
      SELECT 
        c.*,
        u.name AS instructor_name,
        cat.name AS category_name
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.category_id = $1
      ORDER BY c.created_at DESC
      `,
      [category_id]
    );
    return result.rows;
  } catch (err) {
    console.error("Error fetching category courses:", err);
    throw err;
  }
}
