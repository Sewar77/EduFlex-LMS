import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"


export function generateTokens(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
}



export async function verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
}

