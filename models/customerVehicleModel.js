const mongoose = require('mongoose');

const customerVehicleSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    modelName: {
        type: String,
        required: true,
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
    },
    registrationDate: {
        type: Date,
        required: true,
    },
    freeServiceEligibility: {
        type: Boolean,
        default: true,
    },
    freeServiceCount: {
        type: Number,
        default: 0,
    },

}, {
    timestamps: true
});

// Method to check and update the free service eligibility based on the registration date
customerVehicleSchema.methods.updateFreeServiceEligibility = async function () {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    if (this.registrationDate <= oneYearAgo) {
        this.freeServiceEligibility = false;
    } else {
        this.freeServiceEligibility = true;
    }

    await this.save();
}

const customerVehicleModel = mongoose.model('customerVehicle', customerVehicleSchema);

module.exports = customerVehicleModel;