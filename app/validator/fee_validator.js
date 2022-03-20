module.exports = (request, response, next) => {
    const feeConfig = request.body.FeeConfigurationSpec;

    if (!feeConfig) {
      return response.status(422).json({status: 'error', message: 'Fee configuration specs required'});
    }

    if (typeof feeConfig !== 'string') {
      return response.status(422).json({status: 'error', message: 'Invalid Fee configuration specs. Must be of type string'});
    }

    let filteredByLineBreak = feeConfig.split(/\r?\n/).filter(config => config);

    if(filteredByLineBreak.length < 1) {
     return response.status(422)
      .json({status: 'error', message: 'Invalid Fee configuration specs. Must contain fee specifications in right format'});
    }

    filteredByLineBreak.forEach(eachConfigLine => {
        let filteredBySpace = eachConfigLine.split(" ").filter(config => config);
        
        if (filteredBySpace.length !== 8) {
            return response.status(422)
            .json({status: 'error', message: 'Invalid Fee configuration specs. Must contain fee specifications in right format'}); 
        }
    });

    return next();
}
