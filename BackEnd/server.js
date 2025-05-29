import express from "express";
import router from "./src/routes/api.js";
import authRouter from "./src/routes/authRoutes.js";
import "dotenv/config";
const app = express();
const PORT = process.env.PORT || "5000";
const ENV = process.env.NODE_ENV || "development";

app.use(express.json());

app.use("/api", router);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`server.js is started in ${ENV} mode on ${PORT} `);
});
