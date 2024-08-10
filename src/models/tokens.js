import prisma from "../config/prismaClient.js";
import { DatabaseError } from "../utils/exceptions.js";

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
  await prisma.token.create({
    data: {
      user_id,
      token,
      type,
      expiry: new Date(Date.now() + expiration),
    },
  });
}

async function invalidateToken(token, type) {
  await prisma.blacklistedToken.create({
    data: { token: token, type }, // nullify token
  });
}

export { isTokenBlacklisted, saveToken, invalidateToken };
