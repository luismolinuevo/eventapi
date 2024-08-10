import jwt from "jsonwebtoken";
import argon2 from "argon2";
import prisma from "../config/prismaClient.js";
import { AuthError } from "../utils/exceptions.js";
import ms from "ms";
import { saveToken } from "../models/tokens.js";
import {
  JWT_REFRESH_EXPIRATION,
  JWT_ACCESS_EXPIRATION,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
} from "../secrets.js";

// Hash user password
export const hashPassword = async (password) => {
  return await argon2.hash(password);
};

// Verify hashed password
export const verifyPassword = async (hashedPassword, password) => {
  return await argon2.verify(hashedPassword, password);
};

export const signToken = (user, type) => {
  let token;

  if (type == "refresh") {
    token = jwt.sign({ id: user.user_id }, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRATION,
    });
  } else {
    token = jwt.sign({ id: user.user_id }, JWT_ACCESS_SECRET, {
      expiresIn: JWT_ACCESS_EXPIRATION,
    });
  }

  return token;
};

// Generate access token
export const generateAccessToken = (user) => {
  return signToken(user, "access");
};

// Generate refresh token
export const generateRefreshToken = async (user) => {
  try {
    const refreshToken = signToken(user, "refresh");

    await saveToken(
      user.user_id,
      refreshToken,
      "refresh",
      JWT_REFRESH_EXPIRATION
    );

    return refreshToken;
  } catch (error) {
    console.log(error);
    throw new AuthError("Error creating refresh token");
  }
};
