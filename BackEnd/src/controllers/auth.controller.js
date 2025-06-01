import {
  generateTokens,
  verifyPassword,
  generateRefreshTokens,
} from "../utils/auth.js";
import {
  getUserByEmail,
  createUser,
  getUserById,
} from "../models/user.model.js";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

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
        console.error("Google OAuth errer: ", err);
        return res.status(200).json({ message: "You are Loggid in" });
      }
      if (!user) {
        return res.status(200).json({ message: "Not Logged in " });
      }
      try {
        req.login(user, (err) => {
          if (err) {
            console.error("loging error", err);
            return res.status(200).json({ message: "Filed logged in1" });
            // return res.redirect(
            //   `${process.env.CLIENT_URL}/login?error=oauth_failed`
            // );
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
              maxAge: 24 * 60 * 60 * 1000,
            });
            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 24 * 60 * 60 * 1000,
            });
            res.json({ success: true, user });
          });
        });
      } catch (err) {
        next(err);
      }
    }
  )(req, res, next);
};

export async function Register(req, res, next) {
  try {
    const userInfo = { ...req.body };
    const existingUser = await getUserByEmail(userInfo.email); //null if not existing
    if (existingUser) throw new Error("Email already in Use");
    const newUser = await createUser(userInfo);

    //create seesion
    req.session.userId = newUser.id;
    req.session.authenticated = true;

    req.session.save(() => {
      const token = generateTokens(existingUser.id);

      res.cookie("token", token, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      res.json({
        success: true,
        token: token,
        user: {
          id: existingUser.id,
          email: existingUser.email,
          role: existingUser.role,
        },
        message: "Loged In",
      });
    });
  } catch (err) {
    next(err);
  }
}

export async function Login(req, res, next) {
  try {
    const { email, password } = { ...req.body };
    const existingUser = await getUserByEmail(email); //null if not existing
    if (!existingUser) throw new Error("User Not found");
    const isMatch = await verifyPassword(password, existingUser.password_hash);
    if (!isMatch) throw new Error("Email or Password are not correct");

    //create seesion
    req.session.userId = existingUser.id;
    req.session.authenticated = true;

    req.session.save(() => {
      const token = generateTokens(existingUser.id);

      res.cookie("token", token, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      res.json({
        success: true,
        token: token,
        user: {
          id: existingUser.id,
          email: existingUser.email,
          role: existingUser.role,
        },
        message: "Loged In",
      });
    });
  } catch (err) {
    next(err);
  }
}

export async function getCurrentLogInInfo(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }
    const user = await getUserById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    // Destroy session if exists
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        // Clear cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({ success: true, message: "Logged out successfully" });
      });
    } else {
      // Clear cookies even if no session
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.json({ success: true, message: "Logged out successfully" });
    }
  } catch (err) {
    next(err);
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
            "user not found in session"
          )
        );
    }
    const sanitizedUser = sanitizedUser(req.user);
    return res.json(
      createResponse(true, "User retrived seccessfuly", sanitizedUser)
    );
  } catch (err) {
    console.error("Get current user error", error);
    return res
      .status(500)
      .json(createResponse(false, "Server error", null, error.message));
  }
}

export const refreshToken = (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(401)
        .json(
          createResponse(
            false,
            "Refresh token require",
            null,
            "no refresh token provider"
          )
        );
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (decoded) {
    }
    const newAccessToken = generateTokens({
      id: decoded.id,
      email: decoded.email,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json(
      createResponse(true, "token refreshed", { accessToken: newAccessToken })
    );
  } catch (err) {
    console.error("cant refresh token", error);
    return res
      .status(500)
      .json(createResponse(false, "Server error", null, error.message));
  }
};
