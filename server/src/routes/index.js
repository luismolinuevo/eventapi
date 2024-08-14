import { Router } from "express";
import authRoutes from "./auth.js";
import userRoutes from "./user.js";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/user", userRoutes);

export default apiRouter;
