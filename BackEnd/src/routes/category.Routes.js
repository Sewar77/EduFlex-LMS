import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddlware.js";
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/category.controller.js";

const categoryRouter = express.Router();

// Create category
categoryRouter.post(
  "/categories",
  authenticateJWT,
  requireRole("admin"),
  createCategoryController
);

// Get all categories
categoryRouter.get("/categories", authenticateJWT, getAllCategoriesController);

// Get category by ID
categoryRouter.get(
  "/categories/:id",
  authenticateJWT,
  getCategoryByIdController
);

// Update category
categoryRouter.put(
  "/categories/:id",
  authenticateJWT,
  requireRole("admin"),
  updateCategoryController
);

// Delete category
categoryRouter.delete(
  "/categories/:id",
  authenticateJWT,
  requireRole("admin"),

  deleteCategoryController
);

export default categoryRouter;
