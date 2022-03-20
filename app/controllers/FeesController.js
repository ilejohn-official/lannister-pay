const storeFeeConfiguration = require('../services/store_fee_configuration');

module.exports = {
  storeFeeConfiguration: async (request, response) => {
    const feeConfig = request.body.FeeConfigurationSpec;

    try {
     await storeFeeConfiguration(feeConfig);

     response.status(200).json({
      status: "ok",
     });
       
    } catch (error) {
      response.status(400).json({status: 'error', message: error.message});
    }
  },

  computeTransactionFee: async (request, response) => {
    
    try {
      
     response.status(200).json({
       AppliedFeeID: "LNPY0222",
       AppliedFeeValue: 230,
       ChargeAmount: 5230,
       SettlementAmount: 5000
     });
       
    } catch (error) {
      response.status(400).json({status: 'error', message: error.message});
    }
  },
}
