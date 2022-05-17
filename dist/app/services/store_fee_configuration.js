"use strict";
const Fee = require('../models/fee');
const parseFeeConfig = require('./parse_fee_configuration');
module.exports = async (unparsedFeeConfig) => {
    try {
        const parsedFee = parseFeeConfig(unparsedFeeConfig);
        Fee.insertMany(parsedFee, function (error, docs) {
            if (error) {
                throw error;
            }
            return docs;
        });
    }
    catch (error) {
        throw error;
    }
};
