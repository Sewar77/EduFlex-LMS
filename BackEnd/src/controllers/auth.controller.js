import {
  generateTokens,
  verifyPassword,
  generateRefreshTokens,
} from "../utils/auth.js";
import {
  getUserByEmail,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../models/user.model.js";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import { createResponse } from "../utils/helper.js";

//start google oauth flow
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
});

//handle google auth callback
export const googleCallBack = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    async (err, user) => {
      if (err) {
        console.error("Google OAuth error: ", err);
        return res.status(500).json({
          success: false,
          message: "OAuth authentication failed",
        });
      }
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Authentication failed",
        });
      }
      try {
        req.login(user, (err) => {
          if (err) {
            console.error("Login error", err);
            return res.status(500).json({
              success: false,
              message: "Failed to log in",
            });
          }

          req.session.userId = user.id;
          req.session.authenticated = true;

          const tokenPayload = { id: user.id, email: user.email };
          const accessToken = generateTokens(tokenPayload);
          const refreshToken = generateRefreshTokens(tokenPayload);

          req.session.save(() => {
            // Set http-only cookies for security
            res.cookie("accessToken", accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });
            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.json({
              success: true,
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              },
              message: "Successfully logged in",
            });
          });
        });
      } catch (err) {
        next(err);
      }
    }
  )(req, res, next);
};

export async function Register(req, res, next) {
  let newUser = null;

  try {
    const userInfo = { ...req.body };

    // Validate required fields
    if (!userInfo.email || !userInfo.password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const existingUser = await getUserByEmail(userInfo.email);
    if (existingUser) {
      return res.status(409).json({
        // 409 Conflict for duplicate resources
        success: false,
        message: "Email already in use",
      });
    }

    // Create user with tokenVersion for refresh token invalidation
    newUser = await createUser({
      ...userInfo,
      tokenVersion: 0, // Initialize token version
    });

    // Generate tokens with proper error handling
    const tokenPayload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };

    let accessToken, refreshToken;
    try {
      accessToken = generateTokens(tokenPayload);
      refreshToken = generateRefreshTokens(tokenPayload);
    } catch (tokenError) {
      console.error("Token generation failed:", tokenError);
      // Delete the user if token generation fails
      await deleteUser(newUser.id);
      throw new Error("Authentication setup failed");
    }

    // Update user with refresh token
    await updateUser(newUser.id, {
      refreshToken,
      tokenVersion: newUser.tokenVersion + 1, // Increment token version
    });

    // Configure cookies
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: "/",
    };

    const refreshCookieOptions = {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // Set cookies
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    // Create session
    req.session.regenerate((err) => {
      if (err) {
        console.error("Session regeneration error:", err);
        throw err;
      }

      req.session.userId = newUser.id;
      req.session.authenticated = true;
      console.log("userInfo", userInfo); // to check if password is there
      return res.status(201).json({
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
        message: "Registration successful",
      });
    });
  } catch (err) {
    console.error("Registration error:", err);

    // Clean up if user was created but process failed
    if (newUser && newUser.id) {
      try {
        await deleteUser(newUser.id);
      } catch (deleteError) {
        console.error("Failed to clean up user:", deleteError);
      }
    }

    // Send appropriate error response
    const statusCode = err.message.includes("failed") ? 500 : 400;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Registration failed",
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
}

export async function Login(req, res, next) {
  try {
    const { email, password } = req.body;
    console.log("🔍 Login attempt for:", email);
    console.log("🔍 Login attempt for:", password);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    console.log("🔍 Looking up user...");
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if user has password hash (not OAuth-only user)
    if (!existingUser.password_hash) {
      return res.status(401).json({
        success: false,
        message: "Please login with Google",
      });
    }

    // Verify password
    console.log("🔍 Verifying password...");
    const isMatch = await verifyPassword(password, existingUser.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate tokens
    const tokenPayload = {
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    };

    const accessToken = generateTokens(tokenPayload);
    const refreshToken = generateRefreshTokens(tokenPayload);

    console.log(
      "✅ Tokens generated - Access:",
      accessToken.length,
      "chars, Refresh:",
      refreshToken.length,
      "chars"
    );

    // CORRECTED: Cookie settings for localhost development
    process.env.NODE_ENV !== "production";

    const cookieOptions = {
      httpOnly: true,
      secure: false, // Always false for localhost
      sameSite: "lax", // Use 'lax' for localhost
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: "/",
      // Don't set domain for localhost - let browser handle it
    };

    const refreshCookieOptions = {
      httpOnly: true,
      secure: false, // Always false for localhost
      sameSite: "lax", // Use 'lax' for localhost
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
      // Don't set domain for localhost - let browser handle it
    };

    // Set cookies
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    console.log("🍪 Setting cookies with options:", {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      maxAge: cookieOptions.maxAge,
    });

    // Create session
    req.session.userId = existingUser.id;
    req.session.authenticated = true;

    // Save session and send response
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Session creation failed",
        });
      }

      const responseData = {
        success: true,
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
        },
        message: "Login successful",
      };
      console.log("🧠 DB user after login:", responseData);
      res.json(responseData);
    });
  } catch (err) {
    console.error("❌ Login function error:", err);
    next(err);
  }
}

export async function getCurrentLogInInfo(req, res, next) {
  try {
    console.log("loged in req ", req.user);
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    console.log("loged in 2 req", req.user);
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log("loged in  3 ", req.user);

    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");

    const { password_hash, ...sanitizedUser } = user;
    res.json({
      success: true,
      user: sanitizedUser,
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  try {
    const cookieOptions = {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };

    // Clear both access and refresh token cookies
   res.clearCookie("accessToken", {
     path: "/", // Must match cookie settings
     httpOnly: true,
     secure: process.env.NODE_ENV === "production", // true only in prod
     sameSite: "strict",
   });
   res.clearCookie("refreshToken", {
     path: "/",
     httpOnly: true,
     secure: process.env.NODE_ENV === "production",
     sameSite: "strict",
   });


    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
}


export async function getCurrentUser(req, res) {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json(
          createResponse(
            false,
            "Not Authenticated",
            null,
            "User not found in session"
          )
        );
    }

    // Remove password_hash from user object
    const { password_hash, ...sanitizedUser } = req.user;

    return res.json(
      createResponse(true, "User retrieved successfully", sanitizedUser)
    );
  } catch (error) {
    console.error("Get current user error:", error);
    return res
      .status(500)
      .json(createResponse(false, "Server error", null, error.message));
  }
}

// Fixed refreshToken function
export const refreshToken = async (req, res) => {
  try {
    // Get refresh token from cookies
    const refreshTokenFromCookie = req.cookies.refreshToken;

    if (!refreshTokenFromCookie) {
      return res
        .status(401)
        .json(
          createResponse(
            false,
            "Refresh token required",
            null,
            "No refresh token provided"
          )
        );
    }

    // Verify refresh token - Use the correct secret
    const decoded = jwt.verify(
      refreshTokenFromCookie,
      process.env.JWT_REFRESH_SECRET
    );

    // Verify user still exists and is active
    const user = await getUserById(decoded.id);
    if (!user) {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      return res
        .status(401)
        .json(
          createResponse(
            false,
            "User not found",
            null,
            "Invalid refresh token - user does not exist"
          )
        );
    }

    if (!user.is_active) {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      return res
        .status(401)
        .json(
          createResponse(
            false,
            "Account deactivated",
            null,
            "User account is not active"
          )
        );
    }

    // Generate new access token
    const newAccessToken = generateTokens({
      id: decoded.id,
      email: decoded.email,
    });

    // Set new access token cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.json(
      createResponse(true, "Token refreshed successfully", {
        accessToken: newAccessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      })
    );
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      return res
        .status(401)
        .json(
          createResponse(
            false,
            "Refresh token expired",
            null,
            "Please login again"
          )
        );
    }

    if (err.name === "JsonWebTokenError") {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      return res
        .status(401)
        .json(
          createResponse(
            false,
            "Invalid refresh token",
            null,
            "Token is malformed"
          )
        );
    }

    // Clear invalid refresh token for any other error
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    return res
      .status(401)
      .json(createResponse(false, "Invalid refresh token", null, err.message));
  }
};
