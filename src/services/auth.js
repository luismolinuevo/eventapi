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

async function loginService(email, password) {
  try {
    const user = await getUserByEmail(email);

    const compare_password = verifyPassword(user.password, password);

    if (!compare_password || !user) {
      return new AuthError("Invalid email or password");
    }

    const access_token = generateAccessToken(user);
    const refresh_token = await generateRefreshToken(user);

    return { access_token, refresh_token };
  } catch (error) {
    throw new ProgrammingError("Error getting user by id");
  }
}

async function refreshTokens(refreshToken) {
  // Validate the refresh token
  const blacklisted = await isTokenBlacklisted(refreshToken, "refresh");
  if (blacklisted) {
    throw new Error("Refresh token is invalid or expired");
  }

  // Verify and decode the refresh token
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  // Find user associated with the refresh token
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Invalidate the old refresh token
  await invalidateToken(refreshToken);

  // Generate new access token and refresh token
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = await generateRefreshToken(user);

  return { newAccessToken, newRefreshToken, refreshToken };
}

export { loginService };
