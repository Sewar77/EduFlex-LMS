import express from "express";
import userRouter from "./src/routes/user.Routes.js";
import coursesRouter from "./src/routes/course.Routes.js";
import authRouter from "./src/routes/auth.Routes.js";
import lessonRouter from "./src/routes/lesson.Routes.js";
import enrollmentsRouter from "./src/routes/enrollment.Routes.js";
import modulesRouter from "./src/routes/modules.Routes.js";
import assignmentRouter from "./src/routes/assignment.Routes.js";
import quizRouter from "./src/routes/quize.Routes.js";
import submissionRouter from "./src/routes/submissions.Routes.js";
import homeRouter from "./src/routes/home.Routes.js";
import "dotenv/config";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { errorHandler, notFound } from "./src/middleware/error.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "./src/config/passport.js";
import rateLimit from "express-rate-limit";
import { createResponse } from "./src/utils/helper.js";

const app = express();

app.get("/favicon.ico", (req, res) => res.status(204).end());

// 1. Core middleware
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["POST", "DELETE", "PUT", "GET"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const Limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: createResponse(
    false,
    "too many requests",
    null,
    "rate limit exceeded"
  ),
  standardHeaders: true,
  legacyHeader: false,
});
app.use(Limiter);

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: "strict",
  },
};

app.use(session(sessionConfig));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cookieParser());

// 2. Passport
app.use(passport.initialize());
app.use(passport.session());

// 3. Routers
app.use("/api", userRouter);
app.use("/api", lessonRouter);
app.use("/api", coursesRouter);
app.use("/api", enrollmentsRouter);
app.use("/api", modulesRouter);
app.use("/api", homeRouter);
app.use("/api", quizRouter);
app.use("/api", assignmentRouter);
app.use("/api", submissionRouter);
app.use("/api/auth", authRouter);

// 4. Health and root endpoints
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 5. Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
