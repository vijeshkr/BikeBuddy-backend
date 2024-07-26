const mongoose = require('mongoose');

// Password reser scheme
const passwordResetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        required: true,
        // Set expiry 5 minutes from the current time
        default: () => new Date(+ new Date() + 5 * 60 * 1000),
    }
});

// Create mongoose model for password reser tokens 
const passwordResetModel = mongoose.model('passwordReset', passwordResetSchema);

module.exports = passwordResetModel;