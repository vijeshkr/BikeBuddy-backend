const userModel = require('../../models/userModel');
const fs = require('fs');
const path = require('path');

const updateProfile = async (req, res) => {
    const userId = req.userId;
    const { name, email, profilePicture, phone, place } = req.body;

    try {
        // Check for unique email
        const existingUser = await userModel.findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({
                message: 'Email is already in use',
                success: false
            });
        }

        // Find the user by user id
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        // If the profilePicture has changed, delete the old one
        if (user.profilePicture && user.profilePicture !== profilePicture) {
            const filePath = path.join('images', user.profilePicture);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting profile picture:', err);
                } else {
                    console.log('Old profile picture deleted successfully');
                }
            });
        }

        // Update the user
        user.name = name;
        user.email = email;
        user.profilePicture = profilePicture;
        user.phone = phone;
        user.place = place;

        await user.save();

        // Prepare the response object without password field
        const {password: password , ...otherData} = user.toObject();

        // Send a successful response with updated user data
        res.status(200).json({
            message: 'Profile updated successfully',
            success: true,
            data: otherData
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = updateProfile;