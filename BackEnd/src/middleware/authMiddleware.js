import jwt from "jsonwebtoken";
import { getUserById } from "../models/user.model.js";
import { createResponse } from "../utils/helper.js";

// Enhanced authenticateJWT middleware
export const authenticateJWT = async (req, res, next) => {
  try {
    let token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "lms-app",
      audience: "lms-app-users",
    });

    // Get user with token version check
    const user = await getUserById(decoded.id);
    const decodedTokenVersion = decoded.tokenVersion ?? 0;

    if (!user || (user.tokenVersion ?? 0) !== decodedTokenVersion) {
      return res.status(401).json({
        success: false,
        message: "Invalid token - user not found or token revoked",
      });
    }

    // Attach minimal user data to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion ?? 0,
    };
    console.log("Decoded token:", decoded);
    console.log("User attached to req:", req.user);

    next();
  } catch (error) {
    console.error("JWT Authentication Error:", error);

    const response = {
      success: false,
      message: "Authentication failed",
    };

    if (error.name === "TokenExpiredError") {
      response.message = "Token expired - please login again";
      return res.status(401).json(response);
    }

    if (error.name === "JsonWebTokenError") {
      response.message = "Invalid token format";
      return res.status(403).json(response);
    }

    response.message = "Authentication error";
    return res.status(500).json(response);
  }
};

// Optional JWT authentication (doesn't fail if no token)
export const optionalJWT = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } else {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("👤 Decoded JWT:", decoded);

        const user = await getUserById(decoded.id);
        console.log("🗂️ Found DB user:", user);

        if (user && user.is_active) {
          req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar_url: user.avatar_url,
            is_active: user.is_active,
          };
        }
      } catch (error) {
        console.log("Optional JWT failed:", error.message);
      }
    }

    next();
  } catch (error) {
    next();
  }
};

// Session-based authentication (for Passport.js OAuth)
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res
    .status(401)
    .json(
      createResponse(
        false,
        "Authentication required",
        null,
        "User not authenticated"
      )
    );
};

// Legacy token authentication (for backwards compatibility)
export const authenticateToken = async (req, res, next) => {
  try {
    if (req.session && req.session.authenticated && req.session.userId) {
      const user = await getUserById(req.session.userId);
      if (user && user.is_active) {
        req.user = user;
        return next();
      }
    }

    const token = req.cookies.token || req.cookies.accessToken;
    if (!token) {
      return res
        .status(401)
        .json(createResponse(false, "Authentication token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserById(decoded.id);

    if (!user) {
      return res.status(401).json(createResponse(false, "User not found"));
    }

    if (!user.is_active) {
      return res.status(401).json(createResponse(false, "Account deactivated"));
    }

    if (req.session) {
      req.session.userId = user.id;
      req.session.authenticated = true;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token authentication error:", error);
    return res
      .status(403)
      .json(
        createResponse(false, "Invalid or expired token", null, error.message)
      );
  }
};

export default {
  authenticateJWT,
  optionalJWT,
  isAuthenticated,
  authenticateToken,
};
