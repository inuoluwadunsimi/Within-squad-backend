/* istanbul ignore file */
import errorHandler from "errorhandler";

import app from "../app";
import { connectMongo } from "../helpers/mongodb.connector";

app.use(errorHandler());

(async () => {
  // Initialize server
  const server = app.listen(process.env.APP_PORT || 8000, () => {
    connectMongo();
  });

  // Nodemon dev hack
  process.once("SIGUSR2", function () {
    server.close(function () {
      process.kill(process.pid, "SIGUSR2");
    });
  });
})();
