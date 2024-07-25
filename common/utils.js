const nodemailer = require('nodemailer');

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
        console.log('Verification email sent')
    } catch (error) {
        console.error('Error sending verification email: ',error);
    }
}

module.exports = {
    transporter,
    sendVerificationEmail,
}