import {
  getUserByEmail,
  findUserByEmailOrPhone,
  updateUserPassword,
} from "../models/user.js";
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
import { sendResetPasswordEmail } from "../helpers/emails/passwords.js";
import crypto from "crypto";

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
      await sendResetPasswordEmail(user.email, resetToken);
    }
    //   else {
    //     await sendResetSMS(user.phone, resetToken);
    //   }
  } catch (error) {
    console.log(error);
    throw new ProgrammingError("Error handling forgot password");
  }
}

async function resetPassword(token, new_password) {
  try {
    const hashed_provided_token = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const reset_token = await findPasswordResetToken(hashed_provided_token);

    if (!reset_token || reset_token.expires_at < new Date()) {
      throw new AuthError("Invalid or expired reset token");
    }

    await updateUserPassword(reset_token.user_id, new_password);
    await invalidatePasswordResetToken(hashed_provided_token);

    return { message: "Password has been reset" };
  } catch (error) {
    console.log(error);
    throw new ProgrammingError("Error resetting password");
  }
}

async function changePassword(email, new_password) {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      throw new AuthError("Cannot find user with that email");
    }

    await updateUserPassword(user.user_id, new_password);

    return { message: "Password has been reset" };
  } catch (error) {
    console.log(error);
    throw new ProgrammingError("Error resetting password");
  }
}

export { loginService, handleForgotPassword, resetPassword, changePassword };
