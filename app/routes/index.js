const express = require('express');
const router = express.Router();
const { appName } = require("../config");
const {storeFeeConfiguration, computeTransactionFee} = require("../controllers/FeesController");
const validateFeeConfigSpecs = require('../validator/fee_validator');

router.get('/', (request, respond) => {
  respond.send(`${appName} is Online!`);
});

router.post('/fees', validateFeeConfigSpecs, storeFeeConfiguration);

router.post('/compute-transaction-fee', computeTransactionFee);

module.exports = router;
