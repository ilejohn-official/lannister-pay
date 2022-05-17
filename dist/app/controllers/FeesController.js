const storeFeeConfigurationService = require('../services/store_fee_configuration');
const computeTransactionService = require('../services/compute_transaction_fee');
module.exports = {
    storeFeeConfiguration: async (request, response) => {
        const feeConfig = request.body.FeeConfigurationSpec;
        try {
            await storeFeeConfigurationService(feeConfig);
            response.status(200).json({
                status: "ok",
            });
        }
        catch (error) {
            response.status(400).json({ Error: error.message });
        }
    },
    computeTransactionFee: async (request, response) => {
        const currency = request.body.Currency;
        const amount = request.body.Amount;
        const currencyCountry = request.body.CurrencyCountry;
        const customer = request.body.Customer;
        const paymentEntity = request.body.PaymentEntity;
        try {
            const data = await computeTransactionService(currency, amount, currencyCountry, customer, paymentEntity);
            response.status(200).json(data);
        }
        catch (error) {
            response.status(400).json({ Error: error.message });
        }
    },
};
