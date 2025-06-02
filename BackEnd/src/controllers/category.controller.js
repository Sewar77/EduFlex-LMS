import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../models/category.models.js";

// Create category
export async function createCategoryController(req, res) {
  try {
    const categoryInfo = { ...req.body };
    const result = await createCategory(categoryInfo);
    if (result) {
      return res.status(201).json({
        success: true,
        message: "Category created successfully.",
        data: result,
      });
    }
    return res.status(400).json({
      success: false,
      message: "Cannot create category.",
    });
  } catch (err) {
    console.error("Can't create category:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create category. Please try again later.",
    });
  }
}

// Get all categories
export async function getAllCategoriesController(req, res) {
  try {
    const result = await getAllCategories();
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Can't get categories:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get categories. Please try again later.",
    });
  }
}

// Get category by ID
export async function getCategoryByIdController(req, res) {
  const category_id = Number(req.params.id);
  if (!Number.isInteger(category_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
  }
  try {
    const result = await getCategoryById(category_id);
    if (result) {
      return res.status(200).json({
        success: true,
        data: result,
      });
    }
    return res.status(404).json({
      success: false,
      message: "Category not found.",
    });
  } catch (err) {
    console.error("Can't get category:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get category. Please try again later.",
    });
  }
}

// Update category
export async function updateCategoryController(req, res) {
  const category_id = Number(req.params.id);
  if (!Number.isInteger(category_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
  }
  try {
    const categoryInfo = { ...req.body, id: category_id };
    const result = await updateCategory(categoryInfo);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Category updated successfully.",
        data: result,
      });
    }
    return res.status(404).json({
      success: false,
      message: "Category not found.",
    });
  } catch (err) {
    console.error("Can't update category:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update category. Please try again later.",
    });
  }
}

// Delete category
export async function deleteCategoryController(req, res) {
  const category_id = Number(req.params.id);
  if (!Number.isInteger(category_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
  }
  try {
    const result = await deleteCategory(category_id);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Category deleted successfully.",
      });
    }
    return res.status(404).json({
      success: false,
      message: "Category not found.",
    });
  } catch (err) {
    console.error("Can't delete category:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete category. Please try again later.",
    });
  }
}
