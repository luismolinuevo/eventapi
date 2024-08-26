import createServer from "./server.js";
import { PORT } from "./secrets.js";

let server; // Declare a variable to hold the server instance

export const startServer = async () => {
  const app = await createServer();
  const SERVER_PORT = PORT || 3001;

  server = app.listen(SERVER_PORT, () => {
    console.log(`Server is listening at localhost: ${SERVER_PORT}`);
  });

  return server; // Return the server instance
};

export const closeServer = () => {
  if (server) {
    return new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  return Promise.resolve();
};
