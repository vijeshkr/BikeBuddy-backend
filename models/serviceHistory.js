const mongoose = require('mongoose');

const serviceHistorySchema = mongoose.Schema({
    allocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'allocation',
        required: true,
    },
    pickUpCharge: {
        type: Number,
    },
    breakdownCharge: {
        type: Number,
    },
    GST:{
        type: Number,
    },
    serviceName: {
        type: String,
    },
    serviceCharge: {
        type: Number,
    },
    extraWorks: [
        {
            workId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'individualWork',
                required: true,
            },
            workName: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        }
    ]
}, {
    timestamps: true
});

const serviceHistoryModel = mongoose.model('serviceHistory', serviceHistorySchema);
module.exports = serviceHistoryModel;