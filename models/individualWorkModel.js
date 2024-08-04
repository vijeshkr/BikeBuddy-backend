const mongoose = require('mongoose');

// Individual work schema
const individualWorkSchema = new mongoose.Schema({
    workName: { type: String, required: true },
    price: { type: Number, required: true },
    suitable: { type: String, required: true },
}, {
    timestamps: true
});

// Create individual work model
const individualWorkModel = mongoose.model('individualWork', individualWorkSchema);

module.exports = individualWorkModel;