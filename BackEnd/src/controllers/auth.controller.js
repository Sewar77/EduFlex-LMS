import { generateTokens, verifyPassword } from "../utils/auth.js";
import { getUserByEmail, createUser } from "../models/user.model.js";

export async function Register(req, res, next) {
  try {
    const userInfo = { ...req.body };
    const existingUser = await getUserByEmail(userInfo.email); //null if not existing
    if (existingUser) throw new Error("Email already in Use");
    const newUser = await createUser(userInfo);
    const token = generateTokens(newUser.id);
    res.status(201).json({
      seccess: true,
      token: token,
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    });
  } catch (err) {
    next(err);
  }
}
