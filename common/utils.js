const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const passwordResetModel = require('../models/passwordResetModel');

// Setup email transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send verification email
const sendVerificationEmail = async (email,link) => {
    try {
        await transporter.sendMail({
            to: email,
            subject: 'Verify your email',
            html: `Please <a href="${link}">Click here</a> to verify your email. The link will expires in 5 minutes`
        });
    } catch (error) {
        console.error('Error sending verification email: ',error);
    }
}

// Send password reset email
const sendPasswordResetEmail = async (email,link) => {
    try {
        await transporter.sendMail({
            to: email,
            subject: 'Password Reset',
            html: `Please <a href='${link}'>Click here<a/> to reset your password. The link will expires in 5 minutes`
        });
    } catch (error) {
        console.error('Error sending reset password mail: ',error);
    }
}

// Generate reset token
const generateResetToken = (email) => {
    return jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: "5m"});
}

// Save reset token to db
const saveResetTokenToDB = async (email, token, expiry) => {
    try {
        const saveToken = new passwordResetModel({
            email,
            token,
            expiry
        });
        await saveToken.save();
    } catch (error) {
        console.error('Error saving reset token to database: ',error);
    }
}

module.exports = {
    transporter,
    sendVerificationEmail,
    generateResetToken,
    sendPasswordResetEmail,
    saveResetTokenToDB,
}