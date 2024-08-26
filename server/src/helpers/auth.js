import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { AuthError, ProgrammingError } from "../utils/exceptions.js";
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
//may not need await here. may be sync

// Verify hashed password
export const verifyPassword = async (hashedPassword, password) => {
  return await argon2.verify(hashedPassword, password);
};

export const signToken = (user, type) => {
  try {
    let token;
    const payload = user.user_id;

    if (type == "refresh") {
      token = jwt.sign({ id: payload }, JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      });
    } else {
      token = jwt.sign({ id: payload }, JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION,
      });
    }

    return token;
  } catch (error) {
    console.log(error);
    throw new ProgrammingError("Error signing token");
  }
};

// Generate access token
export const generateAccessToken = (user) => {
  return signToken(user, "access");
};

// Generate refresh token
export const generateRefreshToken = async (user) => {
  try {
    const refreshToken = signToken(user, "refresh");

    const expiryTime = new Date(
      Date.now() + ms(process.env.JWT_REFRESH_EXPIRATION)
    );

    await saveToken(user.user_id, refreshToken, "refresh", expiryTime);

    return refreshToken;
  } catch (error) {
    console.log(error);
    throw new AuthError("Error creating refresh token");
  }
};
