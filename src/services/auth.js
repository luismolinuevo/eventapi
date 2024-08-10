import { getUserByEmail } from "../models/user.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyPassword,
} from "../helpers/auth.js";
import { AuthError, ProgrammingError } from "../utils/exceptions.js";

async function loginService(email, password) {
  try {
    const user = await getUserByEmail(email);

    const compare_password = await verifyPassword(user.password, password);

    if (!compare_password || !user) {
      throw new AuthError("Invalid email or password");
    }
    
    const access_token = await generateAccessToken(user);
    const refresh_token = await generateRefreshToken(user);
    
    return { access_token, refresh_token };
  } catch (error) {
    throw new ProgrammingError("Error logging user in");
  }
}

export { loginService };
