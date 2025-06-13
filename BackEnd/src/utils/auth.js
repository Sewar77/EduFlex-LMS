import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Validate JWT configuration on startup
const validateJWTConfig = () => {
  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error("Missing JWT configuration in environment variables");
  }
  if (!process.env.JWT_EXPIRES_IN) {
    process.env.JWT_EXPIRES_IN = "15m"; // Default value
  }
};

validateJWTConfig();

// Generate access token with enhanced security
export function generateTokens(payload) {
  if (!payload || !payload.id || !payload.email) {
    throw new Error("Invalid payload for token generation");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    issuer: "lms-app",
    audience: "lms-app-users",
    subject: payload.id.toString(),
  });
}

// Generate refresh token with separate secret
export const generateRefreshTokens = (payload) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET not configured");
  }

  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      tokenVersion: payload.tokenVersion || 0, // Add token version for invalidation
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    }
  );
};

// Verify access token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error("Token expired");
    } else if (err.name === "JsonWebTokenError") {
      throw new Error("Invalid token format");
    } else {
      throw new Error("Token verification failed");
    }
  }
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error("Refresh token expired");
    } else if (err.name === "JsonWebTokenError") {
      throw new Error("Invalid refresh token format");
    } else {
      throw new Error("Refresh token verification failed");
    }
  }
};

// Password verification
export async function verifyPassword(password, hashedPassword) {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}

// Hash password
export async function hashPassword(password) {
  try {
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error("Password hashing error:", error);
    throw new Error("Password hashing failed");
  }
}

// Generate random string for various uses
export const generateRandomString = (length = 32) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate secure random password
export const generateSecurePassword = (length = 16) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
