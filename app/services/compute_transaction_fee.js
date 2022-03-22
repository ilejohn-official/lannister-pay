const Fee = require('../models/fee');
const parseFeeConfig = require('./parse_fee_configuration');

const roundToTwo = (num) => {
    return +(Math.round(num + "e+2")  + "e-2");
}

module.exports = async (currency, amount, currencyCountry, customer, paymentEntity) => {
    try {
        if (currency !== 'NGN') {
            throw new Error(`No fee configuration for ${currency} transactions.`)
        }

        let query = {};

        if(currencyCountry === 'NG' && paymentEntity.Country === 'NG') {
          query.locale = {$in : ['LOCL', '*']}
        } else {
          query.locale = {$in : ['INTL', '*']}
        }

        query.entityProperty = {$in : [paymentEntity.ID, paymentEntity.Issuer, paymentEntity.Brand, paymentEntity.Number, paymentEntity.SixID, '*']}

        let feeConfig = await Fee.find(query);

        if(!feeConfig) {
            throw new Error("No fee configuration for this transactions.");
        }

        let appliedFeeConfig;

        if(feeConfig.length > 1) { 
            feeConfig = feeConfig.map((config) => {
                config.specCount = [config.locale, config.entityProperty, config.entity].filter(x => x === '*').length;

                return config;  
            }).sort((a, b) => a.specCount - b.specCount);
            
            appliedFeeConfig = feeConfig[0];
        } else {
           appliedFeeConfig = feeConfig;
        }

        let appliedFeeValue;

        if (customer.BearsFee) {
            if (appliedFeeConfig.type === 'PERC') {
             appliedFeeValue = roundToTwo((appliedFeeConfig.value.percentageValue * amount)/100)
            }
             if (appliedFeeConfig.type === 'FLAT') {
             appliedFeeValue = appliedFeeConfig.value.flatValue
            } 
            if (appliedFeeConfig.type === 'FLAT_PERC') {
             appliedFeeValue = appliedFeeConfig.value.flatValue + roundToTwo((appliedFeeConfig.value.percentageValue * amount)/100)
            } else {
             appliedFeeValue = appliedFeeConfig.value.flatValue + roundToTwo((appliedFeeConfig.value.percentageValue * amount)/100)
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
