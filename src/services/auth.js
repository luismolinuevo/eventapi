import { getUserByEmail } from "../models/auth.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyPassword,
} from "../helpers/auth.js";
import { AuthError, ProgrammingError } from "../utils/exceptions.js";
import {
  isTokenBlacklisted,
  saveToken,
  invalidateToken,
} from "../models/tokens.js";
import jwt from "jsonwebtoken";
import prisma from "../config/prismaClient.js";

async function loginService(email, password) {
  try {
    const user = await getUserByEmail(email);

    const compare_password = await verifyPassword(user.password, password);

    if (!compare_password || !user) {
      throw new AuthError("Invalid email or password");
    }

    const access_token = await generateAccessToken(user);
    const refresh_token = await generateRefreshToken(user);

    return { access_token, refresh_token };
  } catch (error) {
    throw new ProgrammingError("Error logging user in");
  }
}

async function refreshTokens(refreshToken) {
  try {
    // Validate the refresh token
    console.log("entered");
    const blacklisted = await isTokenBlacklisted(refreshToken, "refresh");

    console.log(blacklisted);
    if (blacklisted) {
      throw new AuthError("Refresh token is invalid or expired");
    }

    // Verify and decode the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    console.log(decoded);
    // Find user associated with the refresh token
    const user = await prisma.user.findUnique({
      where: { user_id: decoded.id },
    });

    console.log(user);

    if (!user) {
      throw new Error("User not found");
    }

    //   Invalidate the old refresh token
    await invalidateToken(refreshToken, "refresh");

    // Generate new access token and refresh token
    const newAccessToken = await generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user);

    return { newAccessToken, newRefreshToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new ProgrammingError("Error logging user in");
  }
}

export { loginService, refreshTokens };
