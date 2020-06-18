const { createServer } = require("vite");
const dotenv = require("dotenv");
const { CourantVitePlugin, logger } = require("./courantSocketServer");
const chalk = require("chalk");


dotenv.config();
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, APP_PORT } = process.env;

createServer({
  configureServer: [
    CourantVitePlugin({
      accountSid: TWILIO_ACCOUNT_SID,
      authToken: TWILIO_AUTH_TOKEN,
    }),
  ],
}).listen(APP_PORT, () =>
  logger(
    `${chalk.green("Vite")} listening on ${chalk.yellow(
      `http://localhost:${APP_PORT}`
    )}`
  )
);
