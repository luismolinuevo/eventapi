import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import limiter from "../config/rateLimiter.js"
import apiRouter from "./routes/index.js";
import globalErrorHandler from "./middlewares/globalError.js";

//This is your server
export default async function createServer() {
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(morgan("tiny"));
app.use(helmet());
app.use(cors());
app.use(limiter);

app.use("/api", apiRouter);
app.use(globalErrorHandler);

return app;
}