import { signUp, getUser } from "../models/auth.js";
import { validateAuthData } from "../schemas/auth.js";
import { loginService } from "../services/auth.js";
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

    const get_user = await getUser(user_id);

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
    return next(new ProgrammingError());
  }
}

export { signUpController, getUserController, loginController };
