const express = require('express');
const router = express.Router();
const { appName } = require("../config");

router.get('/', (request, respond) => {
  respond.send(`${appName} is Online!`);
});

module.exports = router;
