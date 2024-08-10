import jwt from "jsonwebtoken";
import argon2 from "argon2";
import prisma from "../config/prismaClient.js";
import { AuthError } from "../utils/exceptions.js";
import ms from "ms";

// Hash user password
export const hashPassword = async (password) => {
  return await argon2.hash(password);
};

// Verify hashed password
export const verifyPassword = async (hashedPassword, password) => {
  return await argon2.verify(hashedPassword, password);
};

// Generate access token
export const generateAccessToken = (user) => {
  return jwt.sign({ id: user.user_id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION,
  });
};

// Generate refresh token
export const generateRefreshToken = async (user) => {
  try {
    const refreshToken = jwt.sign(
      { id: user.user_id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
    );

    await prisma.token.create({
      data: {
        user_id: user.user_id,
        token: refreshToken,
        type: "refresh",
        expiry: new Date(Date.now() + ms(process.env.JWT_REFRESH_EXPIRATION)),
      },
      
    });

    return refreshToken;
  } catch (error) {
    console.log(error);
    throw new AuthError("Error creating refresh token");
  }
};

// Verify token and handle blacklist
export const verifyToken = async (token, type = "access") => {
  try {
    let secret =
      type === "access"
        ? process.env.JWT_ACCESS_SECRET
        : process.env.JWT_REFRESH_SECRET;
    const decoded = jwt.verify(token, secret);

    const blacklistedToken = await prisma.token.findFirst({
      where: { token, type },
    });

    if (blacklistedToken) {
      throw new Error("Token has been blacklisted");
    }

    return decoded;
  } catch (err) {
    throw new Error("Invalid token");
  }
};