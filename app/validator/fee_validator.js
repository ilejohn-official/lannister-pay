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

    let id = [];

    filteredByLineBreak.forEach(eachConfigLine => {
        let filteredBySpace = eachConfigLine.split(" ").filter(config => config);
        
        if (filteredBySpace.length !== 8 
            || filteredBySpace[4] !== ':'
            || filteredBySpace[5] !== 'APPLY' 
            || filteredBySpace[1] !== 'NGN'
            || /[A-Z-]|\*\([A-Z-]|\*\)/.test(filteredBySpace[3])
            || !/LNPY/.test(filteredBySpace[0])
            || !['LOCL', 'INTL', '*'].includes(filteredBySpace[2])
            || !['PERC', 'FLAT', 'FLAT_PERC'].includes(filteredBySpace[6])
            || (filteredBySpace[6] === 'FLAT_PERC' && (
                !/:/.test(filteredBySpace[7]) 
                || isNaN(filteredBySpace[7].split(":").filter(config => config)[0]) 
                || isNaN(filteredBySpace[7].split(":").filter(config => config)[1])
                 )
                )
            || (['PERC', 'FLAT'].includes(filteredBySpace[6]) && isNaN(filteredBySpace[7]))
            ) {
            return response.status(422)
            .json({status: 'error', message: 'Invalid Fee configuration specs. Must contain fee specifications in right format'}); 
        }

        id.push(filteredBySpace[0]);
    });

    if ((new Set(id)).length !== id.length) {
        return response.status(422)
            .json({status: 'error', message: 'Invalid Fee configuration specs. Id must be unique'}); 
    }

    return next();
}
