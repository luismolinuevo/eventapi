import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import apiRouter from "./routes/index.js";
import globalErrorHandler from "./middlewares/globalError.js";

//This is your server
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(morgan("tiny"));

app.use("/api", apiRouter);
app.use(globalErrorHandler);

app.listen(3001, () => {
  console.log("Connected to server on port 3001");
});
