import { signUp } from "../models/auth.js";
import {
  validateAuthData,
  validateForgetPasswordData,
  validateResetPasswordSchema,
} from "../schemas/auth.js";
import { invalidateToken } from "../models/tokens.js";
import { loginService, handleForgotPassword } from "../services/auth.js";
import { refreshTokens, refreshAccessToken } from "../services/tokens.js";
import { hashPassword } from "../helpers/auth.js";
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from "../secrets.js";
import {
  ProgrammingError,
  ValidationError,
  AuthError,
} from "../utils/exceptions.js";

async function signUpController(req, res, next) {
  try {
    const { email, password } = req.body;

    const valid = validateAuthData(req.body);

    if (!valid) {
      return next(new ValidationError("Password or Email invalid"));
    }

    const hashedPassword = await hashPassword(password);
    const sign_up = await signUp(email, hashedPassword);

    return res.status(201).json({
      success: true,
      message: "Created user",
    });
  } catch (error) {
    return next(new ProgrammingError());
  }
}

async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;

    const valid = validateAuthData(req.body);

    if (!valid) {
      return next(new ValidationError("Password or Email invalid"));
    }

    const tokens = await loginService(email, password);

    if (!tokens) {
      return next(new AuthError("Password or Email invalid"));
    }
    console.log(tokens);
    res.cookie(ACCESS_TOKEN_NAME, tokens.access_token, {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    res.cookie(REFRESH_TOKEN_NAME, tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "User login success",
    });
  } catch (error) {
    console.log(error);
    return next(new ProgrammingError());
  }
}

//Refresh the access and refresh
async function refreshTokensController(req, res, next) {
  try {
    console.log(req.cookies);
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(new ValidationError("Refresh token is required"));
    }

    // Use the service to handle token refreshing
    const { newAccessToken, newRefreshToken } = await refreshTokens(
      refreshToken
    );

    res.cookie(ACCESS_TOKEN_NAME, newAccessToken, {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    res.cookie(REFRESH_TOKEN_NAME, newRefreshToken, {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Tokens refreshed successfully",
    });
  } catch (error) {
    next(error);
  }
}

// Refresh the access token only
async function refreshAccessTokenController(req, res, next) {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(new ValidationError("Refresh token is required"));
    }

    // Use the service to refresh only the access token
    const { newAccessToken } = await refreshAccessToken(refreshToken);

    res.cookie(ACCESS_TOKEN_NAME, newAccessToken, {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function logoutController(req, res, next) {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(new ValidationError("Refresh token is required"));
    }

    // Invalidate the refresh token
    await invalidateToken(refreshToken, "refresh");

    // Clear the cookies
    res.clearCookie(ACCESS_TOKEN_NAME, {
      httpOnly: true,
      secure: true,
      path: "/",
    });
    res.clearCookie(REFRESH_TOKEN_NAME, {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function forgotPasswordController(req, res, next) {
  try {
    const { emailOrPhone } = req.body;

    const valid = validateForgetPasswordData(emailOrPhone);

    if (!valid) {
      return next(new ValidationError("Email or Phone number is required"));
    }

    // Handle the forgot password logic
    await handleForgotPassword(emailOrPhone);

    return res.status(200).json({
      success: true,
      message: "Password reset link/OTP has been sent to your email/phone",
    });
  } catch (error) {
    next(new ProgrammingError("Failed to process forgot password request"));
  }
}

async function resetPasswordController(req, res, next) {
  try {
    const { token, newPassword } = req.body;

    const valid = validateResetPasswordSchema(req.body);

    if (!valid) {
      return next(new ValidationError("Email or Phone number is required"));
    }

    const response = await resetPassword(token, newPassword);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      response,
    });
  } catch (error) {
    next(new ProgrammingError("Failed to process reset password request"));
  }
}

export {
  signUpController,
  loginController,
  refreshTokensController,
  refreshAccessTokenController,
  logoutController,
  forgotPasswordController,
  resetPasswordController
};
