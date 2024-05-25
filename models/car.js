const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    vin: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});


const Car = mongoose.model('Car', carSchema);

module.exports = Car;

