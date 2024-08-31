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
    extraWorkDescription: {
        type: String,
    },
    extraWorkEstimationAmount: {
        type: Number,
    },
    customerApproval: {
        type: String,
    },
    partsUsed: [
        {
            partId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'sparePart',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            totalPartCost: {
                type: Number, // price * quantity
                required: true,
            }
        }
    ],
    serviceAdvice: {
        type: String,
    },
    totalPartsPrice: {
        type: Number, // Total cost (sum of all parts costs)
    },
}, {
    timestamps: true
});

const allocationModel = mongoose.model('allocation', allocationSchema);
module.exports = allocationModel;