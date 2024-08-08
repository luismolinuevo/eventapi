import express from "express";

//This is your server
const app = express();

app.listen(3001, () => {
  console.log("Connected to server on port 3001");
});
