const userModel = require('../../models/userModel');
const bcrypt = require('bcrypt');

const userPasswordChange = async (req, res) => {
    const userId = req.userId;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Find the user by email
    const user = await userModel.findOne({ _id: userId });

    // Check if the user exists
    if (!user) {
        return res.status(404).json({
            message: 'User not found',
            success: false
        });
    }


    if (user && await bcrypt.compare(oldPassword, user.password)) {

        // Check if passwords match
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                message: 'Passwords do not match',
                success: false
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        // Save the updated user
        await user.save();

        return res.status(200).json({
            message: 'Password reset successful',
            success: true
        });
    } else {
        return res.status(401).json({
            message: 'Incorrect password',
            success: false
        });
    }

}

module.exports = userPasswordChange;