import prisma from "../../config/prismaClient.js";
import { DatabaseError } from "../utils/exceptions.js";
import crypto from "crypto";

async function isTokenBlacklisted(token, type = "refresh") {
  try {
    const blacklistedToken = await prisma.blacklistedToken.findFirst({
      where: { token, type },
    });

    if (blacklistedToken) {
      return true;
    }

    return false;
  } catch (error) {
    console.log("Error checking if token is blacklisted:", error);
    throw new DatabaseError("Failed to check if token is blacklisted");
  }
}

async function saveToken(user_id, token, type, expiration) {
  try {
    const existingToken = await prisma.token.findUnique({
      where: { token },
    });

    if(existingToken) {
      return existingToken; //maybe create new one or something in future
    }
    
    await prisma.token.create({
      data: {
        user_id,
        token,
        type,
        expiry: expiration,
      },
    });
  } catch (error) {
    throw new DatabaseError("Failed to save token");
  }
}

async function invalidateToken(token, type) {
  try {
    await prisma.blacklistedToken.create({
      data: { token: token, type },
    });
  } catch (error) {
    throw new DatabaseError("Failed to invalidate token");
  }
}

async function checkUserToken(user_id) {
  try {
    // Find user associated with the refresh token
    const user = await prisma.user.findUnique({
      where: { user_id: user_id },
    });

    return user;
  } catch (error) {
    throw new DatabaseError("Failed to find user with that token");
  }
}

async function findToken(token) {
  try {
    const existingToken = await prisma.token.findUnique({
      where: { token },
    });

    return existingToken;
  } catch (error) {
    throw new DatabaseError("Failed to find user with that token: " + error);
  }
}

async function createPasswordResetToken(user_id) {
  try {
    // Generate a reset token and hash it
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token expiration time (e.g., 1 hour)
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    // Store the token in the database
    const new_token = await prisma.passwordResetToken.create({
      data: {
        user_id: user_id,
        token: hashedToken,
        expires_at: expiresAt,
        type: "reset",
      },
    });

    return resetToken;
  } catch (error) {
    console.log(error);
    throw new DatabaseError("Failed to create password reset token");
  }
}

async function findPasswordResetToken(token) {
  try {
    const found_token = await prisma.passwordResetToken.findFirst({
      where: {
        token: token,
      },
    });

    return found_token;
  } catch (error) {
    console.log(error);
    throw new DatabaseError("Failed to find reset token");
  }
}

async function invalidatePasswordResetToken(token) {
  return await prisma.passwordResetToken.deleteMany({
    where: { token },
  });
}

export {
  isTokenBlacklisted,
  saveToken,
  invalidateToken,
  checkUserToken,
  createPasswordResetToken,
  findPasswordResetToken,
  invalidatePasswordResetToken,
  findToken
};
