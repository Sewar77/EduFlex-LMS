import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  createUser,
  getUserById,
  getUserbyGoogleId,
} from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

// Validate environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Google OAuth credentials not configured");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      prompt: "select_account",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
      passReqToCallback: true, // Add this for potential future use
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(`Google auth attempt: ${profile.displayName}`);

        // Validate profile has email
        if (!profile.emails?.[0]?.value) {
          throw new Error("No email found in Google profile");
        }

        // Try to find user by Google ID
        let user = await getUserbyGoogleId(profile.id);
        if (user) {
          console.log("Existing user found:", user.email);
          return done(null, user);
        }

        // Create new user
        const userCreated = await createUser({
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos?.[0]?.value,
          oauth_provider: "google",
          oauth_id: profile.id,
          role: "student",
          password: null,
          isVerified: true, // Google-authenticated emails are verified
        });

        console.log("New user created:", userCreated.email);
        return done(null, userCreated);
      } catch (err) {
        console.error("GoogleStrategy error:", err.message);
        return done(err, null);
      }
    }
  )
);

// Secure session serialization
passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    role: user.role,
  });
});

// Deserialize with enhanced error handling
passport.deserializeUser(async (serializedUser, done) => {
  try {
    const user = await getUserById(serializedUser.id);
    if (!user) throw new Error("User not found");
    done(null, user);
  } catch (err) {
    console.error("Deserialization error:", err.message);
    done(err, null);
  }
});

export default passport;
