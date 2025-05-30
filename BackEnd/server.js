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
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";

const app = express();
const PORT = process.env.PORT || "5000";
const ENV = process.env.NODE_ENV || "development";

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
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "strict",
    },
  })
);

// 2. Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      // TODO: Find or create user in your DB here
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// 3. Routers
app.use("/api", router);
app.use("/api/auth", authRouter);

// 4. Health and root endpoints
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
app.get("/", (req, res) => {
  res.send("<a href='/api/auth/google'>LogIn with Google</a>");
});

// 5. Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server.js is started in ${ENV} mode on ${PORT}`);
});
