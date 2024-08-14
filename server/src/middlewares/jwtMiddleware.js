import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../secrets.js";
import { isTokenBlacklisted } from "../models/tokens.js";
import { AuthError, ProgrammingError } from "../utils/exceptions.js";

// async function protect(req, res, next) {
//   try {
//     // 1. Extract the token from the Authorization header
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       throw new AuthError("Authentication token missing or malformed");
//     }

//     const token = authHeader.split(" ")[1];

//     // 2. Verify the token
//     const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

//     // 3. Optionally check if the token is blacklisted
//     const blacklisted = await isTokenBlacklisted(token, "access");
//     if (blacklisted) {
//       throw new AuthError("Token has been blacklisted");
//     }

//     // 4. Attach user information to the request object
//     req.user = { id: decoded.id };

//     // 5. Proceed to the next middleware/route handler
//     next();
//   } catch (error) {
//     console.log(error)
//     next(new ProgrammingError("Error creating refresh token")); // Pass the error to the global error handler
//   }
// }
async function protect(req, res, next) {
  try {
    // 1. Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing or malformed",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify the token
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    // 3. Optionally check if the token is blacklisted
    const blacklisted = await isTokenBlacklisted(token, "access");
    if (blacklisted) {
      return res.status(401).json({
        success: false,
        message: "Token has been blacklisted",
      });
    }

    // 4. Attach user information to the request object
    req.user = { id: decoded.id };

    // 5. Proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.log(error);

    // 6. Handle JWT errors (e.g., token expired or invalid)
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // 7. Handle any other errors
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export { protect };
