import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../secrets.js";
import { isTokenBlacklisted } from "../models/tokens.js";
import { AuthError, ProgrammingError } from "../utils/exceptions.js";

async function protect(req, res, next) {
  try {
    // 1. Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthError("Authentication token missing or malformed");
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify the token
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    // 3. Optionally check if the token is blacklisted
    const blacklisted = await isTokenBlacklisted(token, "access");
    if (blacklisted) {
      throw new AuthError("Token has been blacklisted");
    }

    // 4. Attach user information to the request object
    req.user = { id: decoded.id };

    // 5. Proceed to the next middleware/route handler
    next();
  } catch (error) {
    next(new ProgrammingError("Error creating refresh token")); // Pass the error to the global error handler
  }
}

export { protect };
