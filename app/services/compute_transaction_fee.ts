const Fee = require('../models/fee');
import { ObjectId } from 'mongoose';

interface Query {
    locale: {
        $in : string[]
    },
    entityProperty: object
}

type feeType = 'PERC' | 'FLAT' | 'FLAT_PERC';

interface Config {
    _id: ObjectId,
    feeId: string,
    currency: string,
    locale: string,
    entity: string,
    entityProperty: string,
    type: feeType,
    value: { flatValue: number, percentageValue: number },
    deletedAt: Date | null,
    __v: number,
    createdAt: Date,
    updatedAt: Date
}
interface ConfigExt extends Config {
    specCount?: number
}

interface Response {
    AppliedFeeID: ConfigExt["feeId"],
    AppliedFeeValue: number,
    ChargeAmount: number,
    SettlementAmount: number
}

const roundToTwo = (num : number) => {
    return +(Math.round(Number(num + "e+2"))  + "e-2");
}

async function getFeeConfig(feeConfig : ConfigExt[]): Promise<ConfigExt> {
  if(feeConfig.length > 1) { 
    return feeConfig.map((config) => {
        config.specCount = [config.locale, config.entityProperty, config.entity].filter(x => x === '*').length;
        return config;  
    }).sort((a, b) => a.specCount - b.specCount)[0];   
  }

  return feeConfig[0];
}

async function getAppliedFee(amount: number, customer, appliedFeeConfig: ConfigExt): Promise<Response["AppliedFeeValue"]> {

    if (!customer.BearsFee) {
      return 0;
    }

    if (appliedFeeConfig.type === 'PERC') {
      return roundToTwo((appliedFeeConfig.value.percentageValue * amount)/100)
    }
    if (appliedFeeConfig.type === 'FLAT') {
      return appliedFeeConfig.value.flatValue
    } 
    if (appliedFeeConfig.type === 'FLAT_PERC') {
      return appliedFeeConfig.value.flatValue + roundToTwo((appliedFeeConfig.value.percentageValue * amount)/100)
    }
}

async function buildQuery(currencyCountry : string, paymentEntity) : Promise<Query> {
    let query = {} as Query; 

     if(currencyCountry === 'NG' && paymentEntity.Country === 'NG') {
        query.locale = {$in : ['LOCL', '*']}
      } else {
        query.locale = {$in : ['INTL', '*']}
      }
  
      query.entityProperty = {$in : [paymentEntity.ID, paymentEntity.Issuer, paymentEntity.Brand, paymentEntity.Number, paymentEntity.SixID, '*']}

      return query
  
}

export = async (currency: string, amount: number, currencyCountry: string, customer, paymentEntity): Promise<Response> => {
    if (currency !== 'NGN') {
      throw new Error(`No fee configuration for ${currency} transactions.`)
    }

    const query = await buildQuery(currencyCountry, paymentEntity);

    const feeConfig: ConfigExt[] = await Fee.find(query);

    if(!feeConfig) {
     throw new Error("No fee configuration for this transaction.");
    }

    const appliedFeeConfig = await getFeeConfig(feeConfig);

    const appliedFeeValue = await getAppliedFee(amount, customer, appliedFeeConfig);

    return {
       AppliedFeeID: appliedFeeConfig.feeId,
       AppliedFeeValue: appliedFeeValue,
       ChargeAmount: amount + appliedFeeValue,
       SettlementAmount: amount
    } as Response
}