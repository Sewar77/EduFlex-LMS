import express from "express";
import router from "./src/routes/api.js";
import authRouter from "./src/routes/authRoutes.js";
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
const PORT = process.env.PORT || "5000";
const ENV = process.env.NODE_ENV || "development";

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
app.use("/api", router);
app.use("/api/auth", authRouter);

// 4. Health and root endpoints
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 5. Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server.js is started in ${ENV} mode on ${PORT}`);
});
