import express from "express";
import morgan from "morgan";
import apiRouter from "./routes/index.js";

//This is your server
const app = express();
app.use(express.json());

app.use(morgan("tiny"));

app.use("/api", apiRouter);

app.listen(3001, () => {
  console.log("Connected to server on port 3001");
});
