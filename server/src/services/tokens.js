import { JWT_REFRESH_SECRET } from "../secrets.js";
import {
  isTokenBlacklisted,
  saveToken,
  invalidateToken,
  checkUserToken,
} from "../models/tokens.js";
import jwt from "jsonwebtoken";
import { AuthError, ProgrammingError } from "../utils/exceptions.js";
import { generateAccessToken, generateRefreshToken } from "../helpers/auth.js";

async function verifyRefreshToken(token) {
  try {
    let secret = JWT_REFRESH_SECRET;

    const blacklisted = await isTokenBlacklisted(token, "refresh");

    if (blacklisted) {
      throw new AuthError("Refresh token is invalid or expired");
    }

    const decoded = jwt.verify(token, secret);

    return decoded;
  } catch (err) {
    throw new Error("Invalid token");
  }
}

async function refreshTokens(refreshToken) {
  try {
    // Validate the refresh token
    // const blacklisted = await isTokenBlacklisted(refreshToken, "refresh");

    // if (blacklisted) {
    //   throw new AuthError("Refresh token is invalid or expired");
    // }

    // // Verify and decode the refresh token
    // const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const decoded = await verifyRefreshToken(refreshToken);

    // Find user associated with the refresh token
    // const user = await prisma.user.findUnique({
    //   where: { user_id: decoded.id },
    // });
    const user = await checkUserToken(decoded.id);

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

async function refreshAccessToken(refreshToken) {
  try {
    // Verify and decode the refresh token
    const decoded = await verifyRefreshToken(refreshToken);

    // Find the user associated with the refresh token
    const user = await checkUserToken(decoded.id);

    if (!user) {
      throw new AuthError("User not found");
    }

    // Generate a new access token
    const newAccessToken = await generateAccessToken(user);

    return { newAccessToken };
  } catch (error) {
    console.log(error);
    throw new ProgrammingError("Error refreshing access token");
  }
}

export { verifyRefreshToken, refreshTokens, refreshAccessToken };
