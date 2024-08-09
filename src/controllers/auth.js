import { signUp, getUser } from "../models/auth.js";
import { validateAuthData } from "../schemas/auth.js";
import { loginService } from "../services/auth.js";
import { hashPassword } from "../helpers/auth.js";
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from "../secrets.js";

async function signUpController(req, res) {
  try {
    const { email, password } = req.body;

    const valid = validateAuthData(req.body);

    if (!valid) {
      // If validation fails, return a 400 Bad Request with the validation errors
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: validateAuthData.errors, // Ajv provides a list of errors
      });
    }

    const hashedPassword = await hashPassword(password);
    const sign_up = await signUp(email, hashedPassword);

    return res.status(201).json({
      success: true,
      message: "Created user",
    });
  } catch (error) {
    console.log("Error with signup controller ", error);
    return res.status(500).json({
      success: false,
      message: "Server error with signing up" + error,
    });
  }
}

async function getUserController(req, res) {
  try {
    const { user_id } = req.params;
    //Check if user logged in. Middleware or helper function
    if (!user_id) {
      return res.status(404).json({
        success: false,
        message: "No valid user_id",
      });
    }

    const get_user = await getUser(user_id);

    if (!get_user) {
      return res.status(404).json({
        success: false,
        message: "Cannot find user with that id",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Found user with that id",
      get_user,
    });
  } catch (error) {
    console.log("Error with user controller ", error);
    return res.status(500).json({
      success: false,
      message: "Server error with getting user " + error,
    });
  }
}

async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    const valid = validateAuthData(req.body);

    if (!valid) {
      // If validation fails, return a 400 Bad Request with the validation errors
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: validateAuthData.errors, // Ajv provides a list of errors
      });
    }

    const tokens = await loginService(email, password);
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
    return;
  }
}

export { signUpController, getUserController, loginController };
