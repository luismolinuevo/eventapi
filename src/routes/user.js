import { Router } from "express";
import * as userControllers from "../controllers/user.js";

const router = Router();

router.get("/:user_id", userControllers.getUserController);

export default router;
