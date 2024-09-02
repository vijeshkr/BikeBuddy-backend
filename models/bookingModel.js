const mongoose = require('mongoose');

// Booking schema
const bookingSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    vehicleId: {
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
        required: false
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
        enum: ['Pending', 'Allocated', 'Progress', 'Completed', 'Cancelled', 'Unallocated','Paid','Unpaid','Paid'],
        default: 'Unallocated'
    },
    allocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'allocation'
    },
    breakdown: {
        type: Boolean,
        required: false,
        default: false
    },
    place: {
        type: String
    },
    phone: {
        type: String
    },
}, {
    timestamps: true
});

const bookingModel = mongoose.model('booking', bookingSchema);
module.exports = bookingModel;