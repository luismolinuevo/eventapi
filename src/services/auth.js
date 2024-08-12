import { getUserByEmail, findUserByEmailOrPhone } from "../models/user.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyPassword,
} from "../helpers/auth.js";
import { AuthError, ProgrammingError } from "../utils/exceptions.js";
import {
  createPasswordResetToken,
  findPasswordResetToken,
  invalidatePasswordResetToken,
} from "../models/tokens.js";

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

async function handleForgotPassword(emailOrPhone) {
  try {
    // Find the user by email or phone
    const user = await findUserByEmailOrPhone(emailOrPhone);

    if (!user) {
      throw new AuthError("User not found");
    }

    // Create a password reset token
    const resetToken = await createPasswordResetToken(user.user_id);

    // Send the reset token to the user via email or SMS
    if (user.email === emailOrPhone) {
      await sendResetEmail(user.email, resetToken);
    }
    //   else {
    //     await sendResetSMS(user.phone, resetToken);
    //   }
  } catch (error) {
    throw new ProgrammingError("Error handling forgot password");
  }
}

async function resetPassword(token, newPassword) {
  try {
    const resetToken = await findPasswordResetToken(token);

    if (!resetToken || resetToken.expires_at < new Date()) {
      throw new AuthError("Invalid or expired reset token");
    }

    await updateUserPassword(resetToken.user_id, newPassword);
    await invalidatePasswordResetToken(token);

    return { message: "Password has been reset" };
  } catch (error) {
    throw new ProgrammingError("Error resetting password");
  }
}

export { loginService, handleForgotPassword, resetPassword };
