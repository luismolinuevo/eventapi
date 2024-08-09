import prisma from "../config/prismaClient.js";

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
    console.log("Error with the signup service ", error);
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
    console.log("Error with the login model ", error);
  }
}

async function getUser(user_id) {
  try {
    const get_user = await prisma.user.findFirst({
      where: {
        user_id: parseInt(user_id),
      },
    });

    return get_user;
  } catch (error) {
    console.log("Error with getting user by id ", error);
  }
}

export { signUp, getUser, getUserByEmail };
