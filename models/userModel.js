const mongoose = require('mongoose');

// User registration schema
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'mechanic', 'admin'], default: 'customer', required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
},{
    timestamps: true
});

// Create user model
const userModel = mongoose.model('user',userSchema);

module.exports = userModel;