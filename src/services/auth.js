import { getUserByEmail } from "../models/auth.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyPassword,
} from "../helpers/auth.js";

async function loginService(email, password) {
  try {
    const user = await getUserByEmail(email);

    const compare_password = verifyPassword(user.password, password);

    if (!compare_password || !user) {
      return;
    }

    const access_token = generateAccessToken(user);
    const refresh_token = generateRefreshToken(user);

    return { access_token, refresh_token };
  } catch (error) {
    console.log("Ersdfsf", error);
  }
}

export { loginService };
