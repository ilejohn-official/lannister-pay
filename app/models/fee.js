let mongoose = require("mongoose");

// Get the Schema constructor
let Schema   = mongoose.Schema;

let feeSchema = new Schema({
  feeId: { type: String, unique: true, required: true },
  currency: { type: String },
  locale: { type: String },
  entity: { type: String },
  entityProperty: { type: String, default: null },
  type: { type: String,},
  value: { type: String, },
  deletedAt: {type: Date, default: null, required: false},
},
{
  timestamps: true,
  collection: 'fees'
});

module.exports = mongoose.model("Fee", feeSchema);
