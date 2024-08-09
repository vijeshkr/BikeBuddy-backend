const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    mechanicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    reason: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    days: {
        type: Number,
        default: function () { return this.calculateDays(); }
    },
    halfDay: {
        type: Boolean,
        required: false,
    },
    status: {
        type: String,
        default: 'Pending'
    }
}, {
    timestamps: true
});

// Method to calculate leave days
leaveSchema.methods.calculateDays = function () {
    const oneDay = 24 * 60 * 60 * 1000
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);

    totalDays = Math.round((endDate - startDate) / oneDay);

    return this.halfDay ? 0.5 : totalDays;
}

// Pre save middleware to ensure days is calculated before saving
leaveSchema.pre('save', function (next) {
    if (this.isModified('startDate') || this.isModified('endDate') || this.isModified('halfDay')) {
        this.days = this.calculateDays();
    }
    next();
});

const leaveModel = mongoose.model('leave', leaveSchema);
module.exports = leaveModel;