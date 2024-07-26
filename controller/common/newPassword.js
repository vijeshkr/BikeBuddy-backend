const passwordResetModel = require("../../models/passwordResetModel");
const userModel = require("../../models/userModel");
const bcrypt = require('bcrypt');

const newPassword = async (req, res) => {
    const { password, confirmPassword, token } = req.body;
    try {
        // Find the reset token from the database
        const resetToken = await passwordResetModel.findOne({token});
        // Check the token exists and is not expired
        if(resetToken && resetToken.expiry > Date.now()){
            // Find all reset token with the same email address
            const resetTokens = await passwordResetModel.find({ email:resetToken.email });

            // Iterate through reset tokens
            for(const resetToken of resetTokens){
                // Check if the token is expired
                if(resetToken.expiry < Date.now()){
                    // Delete the expired tokens from the database
                    await passwordResetModel.deleteOne({_id: resetToken._id});
                }
            }

            // Find the user by email
            const user = await userModel.findOne({ email: resetToken.email });

            // Check if the user exists
            if(!user){
                return res.status(404).json({ 
                    message: 'User not found',
                    success: false
                });
            }

            // Check if passwords match
            if(password !== confirmPassword){
                return res.status(400).json({
                    message: 'Passwords do not match',
                    success: false
                });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Update the user's password
            user.password = hashedPassword;
            // Save the updated user
            await user.save();

            // Delete the reset token from the database
            await passwordResetModel.deleteOne({_id: resetToken._id});
            return res.status(200).json({
                message: 'Password reset successful',
                success: true
            });
        }else{
            // Invalid token
            return res.status(400).json({
                message: 'Invalid or expired token',
                success: false
            });
        }
    } catch (error) {
        console.error('Error resetting password: ',error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = newPassword;