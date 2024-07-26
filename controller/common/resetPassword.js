const { generateResetToken, saveResetTokenToDB, sendPasswordResetEmail } = require("../../common/utils");
const userModel = require("../../models/userModel");

const resetPassword = async (req, res) => {

    const { email } = req.body;
    try {
        // Find user by email
        const user = await userModel.findOne({ email });
        if(!user){
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        // Generate reset token
        const resetToken = generateResetToken(email);
        // Save reset token to db
        await saveResetTokenToDB(
            email,
            resetToken,
            new Date(+ new Date() + 5 * 60 * 1000)
        );

        // Construct reset link
        const link = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send reset password email
        await sendPasswordResetEmail(email, link);

        return res.status(200).json({
            message: 'Link to reset password was sent to your mail',
            success: true
        });

    } catch (error) {
        console.error('Error resetting password: ',error);
        return res.status(500).json({
            message: 'Failed to reset password. Please try again later.',
            success: false
        })
    }
}

module.exports = resetPassword;