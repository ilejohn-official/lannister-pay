require("dotenv").config();

module.exports = {
  appName: process.env.APP_NAME,
  port: process.env.APP_PORT,
  dbUrl: process.env.DB_URL,
  appEnv: process.env.APP_ENV,
  appKey: process.env.APP_KEY,
  appUrl: process.env.APP_URL,
};