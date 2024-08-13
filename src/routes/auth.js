import { Router } from "express";
import * as authControllers from "../controllers/auth.js";
import { protect } from "../middlewares/jwtMiddleware.js";

const router = Router();

router.post("/signup", authControllers.signUpController);
router.post("/login", authControllers.loginController);
router.post("/refresh_tokens", authControllers.refreshTokensController);
router.post("/refresh", authControllers.refreshAccessTokenController);
router.post("/forgot_password", authControllers.forgotPasswordController);
router.post("/reset_password", authControllers.resetPasswordController);
router.post(
  "/change_password",
  protect,
  authControllers.changePasswordController
);

export default router;
