import { Router } from "express";
import * as authControllers from "../controllers/auth.js";

const router = Router();

router.post("/signup", authControllers.signUpController);
router.post("/login", authControllers.loginController);
router.post("/refresh", authControllers.refreshTokenController);

export default router;
