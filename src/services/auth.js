import prisma from "../config/prismaClient";

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

export { signUp };
