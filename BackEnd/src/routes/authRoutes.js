import { Router } from "express";
import { Register, Login } from "../controllers/auth.controller.js";
import { registerSchema } from "../validation/register.Schema.js";
import { loginSchema } from "../validation/login.Schema.js";
import { validateBody } from "../middleware/validateBody.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getCurrentLogInInfo } from "../controllers/auth.controller.js";
import { authorize } from "../middleware/authorize.js";

const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), Register);
authRouter.post("/login", validateBody(loginSchema), Login);

authRouter.get("/me", authenticateToken, getCurrentLogInInfo);

authRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/home");
  }
);
export default authRouter;
