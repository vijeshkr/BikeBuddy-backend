const mongoose = require('mongoose');

const allocationSchema = mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'booking',
        required: true,
    },
    mechanicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
}, {
    timestamps: true
});

const allocationModel = mongoose.model('allocation', allocationSchema);
module.exports = allocationModel;