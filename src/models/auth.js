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

export { signUp };
