import { signUp, getUserById } from "../models/auth.js";
import { validateAuthData } from "../schemas/auth.js";
import { loginService, refreshTokens } from "../services/auth.js";
import { hashPassword } from "../helpers/auth.js";
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from "../secrets.js";
import {
  ProgrammingError,
  ValidationError,
  NotFoundError,
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

async function getUserController(req, res, next) {
  try {
    const { user_id } = req.params;
    //Check if user logged in. Middleware or helper function
    if (!user_id) {
      return next(new ValidationError("User invalid"));
    }

    const get_user = await getUserById(user_id);

    if (!get_user) {
      return next(new NotFoundError("Password or Email invalid"));
    }

    return res.status(200).json({
      success: true,
      message: "Found user with that id",
      get_user,
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
    console.log(tokens)
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
    console.log(error)
    return next(new ProgrammingError());
  }
}

async function refreshTokenController(req, res, next) {
  try {
    console.log(req.cookie)
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
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
    next(error); // Pass errors to the global error handler
  }
}

export {
  signUpController,
  getUserController,
  loginController,
  refreshTokenController,
};
