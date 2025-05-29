import express from "express";
import router from "./src/routes/api.js";
import authRouter from "./src/routes/authRoutes.js";
import "dotenv/config";
import { errorHandler, notFound } from "./src/middleware/error.js";
const app = express();
const PORT = process.env.PORT || "5000";
const ENV = process.env.NODE_ENV || "development";

app.use(express.json());

app.use("/api", router);
app.use("/api/auth", authRouter);


app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
app.use(errorHandler)
app.use(notFound)



app.listen(PORT, () => {
  console.log(`server.js is started in ${ENV} mode on ${PORT} `);
});
