const userModel = require('../../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../../common/utils');

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({
            message: 'Please fill all fields',
            success: false
        });
    }
    try {
        // Find user by email
        const user = await userModel.findOne({ email });

        // Check if user exists and password matches
        if (user && await bcrypt.compare(password, user.password)) {
            // Check if the user is verified
            if (!user.isVerified) {
                // Generate verification token
                const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
                    expiresIn: '5m'
                });
                // Save verification token to user document
                user.verificationToken = verificationToken;
                await user.save();
                // Send verification email with new link
                const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${user.verificationToken}`;
                await sendVerificationEmail(user.email, verificationLink);

                return res.status(403).json({
                    message: 'Email is not verified, Please verify your email',
                    success: false,
                    pendingVerification: true
                });
            }

            // Generate token
            const token = await user.generateAuthToken();

            // Generate cookie
            res.cookie('accessToken',token, {
                expires: new Date(Date.now() + 86400000),
                httpOnly: true
            });

            // Response with user data excluding password
            const {password: userPassword, ...otherData} = user.toObject();
            const result = {
                user: otherData,
                token
            }
            return res.status(200).json({
                message: 'Login successfull',
                success: true,
                result
            })
        } else {
            return res.status(401).json({
                message: 'Invalid email or password',
                success: false
            });
        }
    } catch (error) {
        console.error('Error while logging in: ', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}

module.exports = userLogin;