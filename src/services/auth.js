import { getUserByEmail } from "../models/auth.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyPassword,
} from "../helpers/auth.js";
import { AuthError, ProgrammingError } from "../utils/exceptions.js";

async function loginService(email, password) {
  try {
    const user = await getUserByEmail(email);

    const compare_password = verifyPassword(user.password, password);

    if (!compare_password || !user) {
        return new AuthError("Invalid email or password");
    }

    const access_token = generateAccessToken(user);
    const refresh_token = await generateRefreshToken(user);

    return { access_token, refresh_token };
  } catch (error) {
    throw new ProgrammingError("Error getting user by id");
  }
}

export { loginService };
