const Fee = require('../models/fee');
const parseFeeConfig = require('./parse_fee_configuration');

module.exports = async (amount, currencyCountry, customer, paymentEntity) => {
    try {
        let query = {};

        if(currencyCountry === paymentEntity.Country === 'NGN') {
          query.locale = {$in : ['LOCL', '*']}
        }

        if(currencyCountry !== paymentEntity.Country) {
          query.locale = {$in : ['INTL', '*']}
        }

        if (['CREDIT-CARD', 'DEBIT-CARD'].includes(paymentEntity.Type)) {
          query.entityProperty = {$in : [paymentEntity.Brand, '*']}
        } else {
          query.entityProperty = {$in : [paymentEntity.ID, paymentEntity.Issuer, paymentEntity.Brand, paymentEntity.Number, paymentEntity.SixID, '*']}
        }

        let feeConfig = await Fee.findOne(query);

        if(!feeConfig) {
            throw new Error("fee config doesn't match");
        }

        let appliedFeeConfig;

        if(feeConfig.length > 1) { 
            feeConfig = feeConfig.map((config) => {
                config.specCount = [config.locale, config.entityProperty, config.entity].filter(x => x === '*').length;
            }).sort((a, b) => a.specCount - b.specCount);

            appliedFeeConfig = feeConfig[0];
        } else {
           appliedFeeConfig = feeConfig;
        }

        let appliedFeeValue;

        if (customer.BearsFee) {
            if (appliedFeeConfig.type === 'PERC') {
             appliedFeeValue = Number((appliedFeeConfig.value.percentageValue/100).toFixed(2)) * amount
            }
             if (appliedFeeConfig.type === 'FLAT') {
             appliedFeeValue = appliedFeeConfig.value.flatValue
            } 
            if (appliedFeeConfig.type === 'FLAT_PERC') {
             appliedFeeValue = appliedFeeConfig.value.flatValue + (Number((appliedFeeConfig.value.percentageValue/100).toFixed(2)) * amount)
            } else {
             appliedFeeValue = appliedFeeConfig.value.flatValue + (Number((appliedFeeConfig.value.percentageValue/100).toFixed(2)) * amount)
            }

        } else {
           appliedFeeValue = 0
        }


     return {
        AppliedFeeID: appliedFeeConfig.feeId,
        AppliedFeeValue: appliedFeeValue,
        ChargeAmount: amount + appliedFeeValue,
        SettlementAmount: amount
     }
    } catch (error) {
        throw error
    } 
}
