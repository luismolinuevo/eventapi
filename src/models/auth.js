import prisma from "../config/prismaClient.js";
import { DatabaseError } from "../utils/exceptions.js";

async function signUp(email, password) {
  try {
    const create_user = await prisma.user.create({
      data: {
        email: email,
        password: password,
      },
    });

    return true;
  } catch (error) {
    throw new DatabaseError("Error creating user");
  }
}

async function getUserByEmail(email) {
  try {
    const get_user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    return get_user;
  } catch (error) {
    throw new DatabaseError("Error getting user by email");
  }
}

async function getUserById(user_id) {
  try {
    const get_user = await prisma.user.findFirst({
      where: {
        user_id: parseInt(user_id),
      },
    });

    return get_user;
  } catch (error) {
    throw new DatabaseError("Error getting user by id");
  }
}

async function isTokenBlacklisted(token) {
  const blacklistedToken = await prisma.blacklistedToken.findUnique({
    where: { token },
  });

  return !!blacklistedToken;
}

export { signUp, getUserById, getUserByEmail, isTokenBlacklisted };
