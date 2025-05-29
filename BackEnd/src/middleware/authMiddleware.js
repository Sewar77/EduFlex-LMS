import jwt from "jsonwebtoken";
import { getUserById } from "../models/user.model.js";

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 
  if (!token) {
    throw new Error("Auth token missing");
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserById(decode.id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}
