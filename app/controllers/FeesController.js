
module.exports = {
  storeFeeConfiguration: async (request, response) => {
    
    try {
      
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
