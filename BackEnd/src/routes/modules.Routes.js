import { ModuleSchema } from "../validation/modules.Schema.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import express from "express";
import { requireRole } from "../middleware/roleMiddlware.js";
import { validateBody } from "../middleware/validateBody.js";
import {
  createModuleController,
  updateModuleController,
  deleteModuleController,
  getAllModulesController,
  getModuleByIdController,
} from "../controllers/module.controller.js";

const modulesRouter = express.Router();

//modules
modulesRouter.post(
  "/modules",
  authenticateJWT,
  requireRole("instructor", "admin"),
  validateBody(ModuleSchema),
  createModuleController
);
modulesRouter.put(
  "/modules/:id",
  authenticateJWT,
  requireRole("instructor", "admin"),
  validateBody(ModuleSchema),
  updateModuleController
);
modulesRouter.get(
  "/courses/:course_id/modules",
  authenticateJWT,
  getAllModulesController
);

modulesRouter.get("/modules/:id", authenticateJWT, getModuleByIdController);

modulesRouter.delete(
  "/modules/:id",
  authenticateJWT,
  requireRole("instructor", "admin"),
  deleteModuleController
);

export default modulesRouter;
