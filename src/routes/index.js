import { Router } from "express";
import authRoutes from "./auth.js";

const apiRouter = Router();

apiRouter.use(authRoutes);

export { apiRouter };
