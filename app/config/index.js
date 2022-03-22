require("dotenv").config();

module.exports = {
  appName: process.env.APP_NAME,
  port: process.env.PORT || 3000,
  dbUrl: process.env.DB_URL,
  appEnv: process.env.APP_ENV,
  appKey: process.env.APP_KEY,
  appUrl: process.env.APP_URL,
};
//process.env.APP_ENV === 'test' ? process.env.DB_URL_TEST : 