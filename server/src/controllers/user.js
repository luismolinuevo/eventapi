import { getUserById } from "../models/user.js";
import { NotFoundError, ProgrammingError } from "../utils/exceptions.js";

async function getUserController(req, res, next) {
  try {
    const { user_id } = req.params;
    console.log(user_id)
    if (!user_id) {
      return next(new ValidationError("User invalid"));
    }

    const get_user = await getUserById(user_id);

    if (!get_user) {
      return next(new NotFoundError("User invalid"));
    }

    return res.status(200).json({
      success: true,
      message: "Found user with that id",
      get_user,
    });
  } catch (error) {
    console.log(error
        )
    return next(new ProgrammingError());
  }
}

export { getUserController };
