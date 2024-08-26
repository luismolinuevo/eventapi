import createServer from "./server.js";
import { PORT } from "./secrets.js";

const startServer = async () => {
  const app = await createServer();
  const SERVER_PORT = PORT || 3001;

  app.listen(SERVER_PORT, () => {
    console.log(`Server is listening at localhost:${SERVER_PORT}`);
  });
};

startServer();
