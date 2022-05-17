"use strict";
const Fee = require('../models/fee');
const roundToTwo = (num) => {
    return +(Math.round(Number(num + "e+2")) + "e-2");
};
async function getFeeConfig(feeConfig) {
    if (feeConfig.length > 1) {
        return feeConfig.map((config) => {
            config.specCount = [config.locale, config.entityProperty, config.entity].filter(x => x === '*').length;
            return config;
        }).sort((a, b) => a.specCount - b.specCount)[0];
    }
    return feeConfig[0];
}
async function getAppliedFee(amount, customer, appliedFeeConfig) {
    if (!customer.BearsFee) {
        return 0;
    }
    if (appliedFeeConfig.type === 'PERC') {
        return roundToTwo((appliedFeeConfig.value.percentageValue * amount) / 100);
    }
    if (appliedFeeConfig.type === 'FLAT') {
        return appliedFeeConfig.value.flatValue;
    }
    if (appliedFeeConfig.type === 'FLAT_PERC') {
        return appliedFeeConfig.value.flatValue + roundToTwo((appliedFeeConfig.value.percentageValue * amount) / 100);
    }
}
module.exports = async (currency, amount, currencyCountry, customer, paymentEntity) => {
    if (currency !== 'NGN') {
        throw new Error(`No fee configuration for ${currency} transactions.`);
    }
    let query = {};
    if (currencyCountry === 'NG' && paymentEntity.Country === 'NG') {
        query.locale = { $in: ['LOCL', '*'] };
    }
    else {
        query.locale = { $in: ['INTL', '*'] };
    }
    query.entityProperty = { $in: [paymentEntity.ID, paymentEntity.Issuer, paymentEntity.Brand, paymentEntity.Number, paymentEntity.SixID, '*'] };
    let feeConfig = await Fee.find(query);
    if (!feeConfig) {
        throw new Error("No fee configuration for this transaction.");
    }
    const appliedFeeConfig = await getFeeConfig(feeConfig);
    const appliedFeeValue = await getAppliedFee(amount, customer, appliedFeeConfig);
    return {
        AppliedFeeID: appliedFeeConfig.feeId,
        AppliedFeeValue: appliedFeeValue,
        ChargeAmount: amount + appliedFeeValue,
        SettlementAmount: amount
    };
};
