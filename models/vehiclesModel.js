const mongoose = require('mongoose');

// Vehicles schema
const vehiclesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

const vehiclesModel = mongoose.model('vehicles', vehiclesSchema);

module.exports = vehiclesModel;