module.exports = (feeConfig) => {
    let filteredByLineBreak = feeConfig.split(/\r?\n/).filter(config => config);

    return filteredByLineBreak.map(configLine => {
        let configElementsArray = configLine.split(" ").filter(config => config);
//to improve on validation that entity follows pattern

        let feeId = configElementsArray[0],
        currency = configElementsArray[1],
        locale = configElementsArray[2],
        entity = configElementsArray[3].split("(").filter(config => config)[0],
        entityProperty = configElementsArray[3].match(/\(([^)]+)\)/)[1],
        type = configElementsArray[6],
        value = {};

        if (type === 'PERC') {
            value = { flatValue: 0, percentageValue: Number(configElementsArray[7]) }
        }
        if (type === 'FLAT') {
            value = { flatValue: Number(configElementsArray[7]), percentageValue: 0 }
        }
        if (type === 'FLAT_PERC') {
            let splitValue = configElementsArray[7];
            let splitValueArray = splitValue.split(":").filter(config => config);
            value = { flatValue: Number(splitValueArray[0]), percentageValue: Number(splitValueArray[1]) }
        }

        return {
            feeId, currency, locale, entity, entityProperty, type, value
        }
    });
}
