import { signUp, getUser } from "../models/auth.js";
import { validateSignUp } from "../schemas/auth.js";

async function signUpController(req, res) {
  try {
    const { email, password } = req.body;

    const valid = validateSignUp(req.body);

    if (!valid) {
      // If validation fails, return a 400 Bad Request with the validation errors
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: validateSignUp.errors, // Ajv provides a list of errors
      });
    }

    const sign_up = await signUp(email, password);

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

export { signUpController, getUserController };
