const mongoose = require('mongoose');

// Booking schema
const bookingSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    vehicleName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customerVehicle',
        required: true,
    },
    bookingDate: {
        type: Date,
        required: true,
    },
    serviceType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'servicePackage',
        required: true
    },
    pickUp: {
        type: Boolean,
        required: false,
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
}, {
    timestamps: true
});

const bookingModel = mongoose.model('booking', bookingSchema);
module.exports = bookingModel;