import prisma from "../config/prismaClient.js";
import { DatabaseError } from "../utils/exceptions.js";
import { hashPassword } from "../helpers/auth.js";

async function getUserByEmail(email) {
  try {
    const get_user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return get_user;
  } catch (error) {
    console.log(error)
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

async function findUserByEmailOrPhone(emailOrPhone) {
  try {
    console.log(emailOrPhone)
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: emailOrPhone }, { phone: emailOrPhone }] },
    });

    return user;
  } catch (error) {
    console.log(error)
    throw new DatabaseError("Failed to find user");
  }
}

async function updateUserPassword(user_id, new_password) {
  const hashed_password = await hashPassword(new_password);
  try {
    const user = await prisma.user.findUnique({
      where: {
        user_id: user_id,
      },
      data: {
        password: hashed_password,
      }
    });

    return user;
  } catch (error) {
    throw new DatabaseError("Failed to update user password");
  }
}

export {
  getUserByEmail,
  getUserById,
  findUserByEmailOrPhone,
  updateUserPassword,
};
