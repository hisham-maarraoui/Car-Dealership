const mongoose = require("mongoose");
const Schema = mongoose.Schema;

require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

const carSchema = new Schema(
  {
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    price: {
      type: Currency,
      required: true,
      min: 0,
    },
    vin: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
