const mongoose = require('mongoose');

// Achievements Schema
const achievementSchema = new mongoose.Schema({
    month: {
        type: String,
        required: true
    },
    labourTarget: {
        type: Number,
        default: 0
    },
    labourAchievement: {
        type: Number,
        default: 0
    },
    spareTarget: {
        type: Number,
        default: 0
    },
    spareAchievement: {
        type: Number,
        default: 0
    },
    incentivePercentage: {
        type: Number,
        default: 0
    }
});

// Targets schema
const mechanicTargetSchema = new mongoose.Schema({
    mechanicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    baseSalary: {
        type: Number,
        default: 0,
        required: true
    },
    achievement: [achievementSchema],
});

const mechanicTargetsModel = mongoose.model('mechanicTargets',mechanicTargetSchema);
module.exports = mechanicTargetsModel;
