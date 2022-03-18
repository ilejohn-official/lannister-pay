const express = require('express');
const router = express.Router();
const { appName } = require("../config");
const {storeFeeConfiguration, computeTransactionFee} = require("../controllers/FeesController");

router.post('/fees', storeFeeConfiguration);

router.post('/compute-transaction-fee', computeTransactionFee);

router.get('/', (request, respond) => {
  respond.send(`${appName} is Online!`);
});

module.exports = router;
