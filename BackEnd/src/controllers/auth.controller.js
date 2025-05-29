import { generateTokens, verifyPassword } from "../utils/auth.js";
import {
  getUserByEmail,
  createUser,
  getUserById,
} from "../models/user.model.js";

export async function Register(req, res, next) {
  try {
    const userInfo = { ...req.body };
    const existingUser = await getUserByEmail(userInfo.email); //null if not existing
    if (existingUser) throw new Error("Email already in Use");
    const newUser = await createUser(userInfo);
    const token = generateTokens(newUser.id);
    res.status(201).json({
      success: true,
      token: token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
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
    const token = generateTokens(existingUser.id);
    res.json({
      success: true,
      token: token,
      user: {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getCurrentLogInInfo(req, res) {
  try {
    const user = await getUserById(req.user.id); //null if not existing
    if (!user) throw new Error("User Not found");
    res.json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
}
