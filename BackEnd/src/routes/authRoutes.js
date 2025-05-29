import { Router } from "express";
import { Register } from "../controllers/auth.controller.js";
import { registerSchema } from "../validation/register.Schema.js";
import { validateBody } from "../middleware/validateBody.js";

const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), Register);

export default authRouter;
