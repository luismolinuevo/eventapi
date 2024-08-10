import prisma from "../config/prismaClient.js";
import { DatabaseError } from "../utils/exceptions.js";

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

export { getUserByEmail, getUserById };
