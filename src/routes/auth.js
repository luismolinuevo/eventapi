import { Router } from "express";
import * as authControllers from "../controllers/auth.js";

const router = Router();

router.post("/signup", authControllers.signUpController);
router.get("/user/:user_id", authControllers.getUserController);
router.post("/login", authControllers.loginController);

export default router;
