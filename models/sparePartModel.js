const mongoose = require('mongoose');

// Spare parts schema
const sparePartSchema = new mongoose.Schema({
    itemName: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: Number, require: true},
    stock: {type: Number, required: true, default: 0},
    suitable: {type: mongoose.Schema.Types.ObjectId, ref: 'vehicles', required: true},
}, {
    timestamps: true,
});

const sparePartModel = mongoose.model('sparePart', sparePartSchema);

module.exports = sparePartModel;