module.exports = async (request, response, next) => {
    const amount = request.body.Amount;
    const currencyCountry = request.body.CurrencyCountry;
    const customer = request.body.Customer;
    const paymentEntity = request.body.PaymentEntity;

    if (!amount || !currencyCountry || !customer || !paymentEntity) {
      return response.status(422).json({status: 'error', message: 'Transaction payload required'});
    }

    return next();
}
