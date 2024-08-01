const mongoose = require('mongoose');

// Service packages schema
const servicePackageSchema = new mongoose.Schema({
    packageName:{type: String, required: true},
    price:{type: Number, required: true},
    description:{type: String, required: true},
    suitable:{type: String, required: true},
},{
    timestamps: true
});

// Create service package model
const servicePackageModel = mongoose.model('servicePackage',servicePackageSchema);

module.exports = servicePackageModel;