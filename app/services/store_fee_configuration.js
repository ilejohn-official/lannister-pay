const Fee = require('../models/fee');
const parseFeeConfig = require('./parse_fee_configuration');

module.exports = async (unparsedFeeConfig) => {
    try {
     const parsedFee = parseFeeConfig(unparsedFeeConfig);

     return Fee.create(parsedFee);
    } catch (error) {
        throw error
    } 
}
