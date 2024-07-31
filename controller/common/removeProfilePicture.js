const fs = require('fs');
const path = require('path');
const userModel = require('../../models/userModel');

const removeProfilePicture = async (req, res) => {
    const userId = req.userId;
    try {
        // Find the user by id
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        // Delete the profile picture file if it's exists
        if (user.profilePicture) {
            const filePath = path.join('images', user.profilePicture);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting profile picture:', err);
                } else {
                    console.log('Profile picture deleted successfully');
                }
            });
        }

        if(user.profilePicture !== null){
            // Update the user document to remove the profile picture
        user.profilePicture = null;
        await user.save();

        const { password: password, ...otherData } = user.toObject();

        res.status(200).json({
            message: 'Profile picture removed successfully',
            success: true,
            data: otherData

        });
        }else{
            return res.status(404).json({
                message: 'Profile picture not found',
                success: false
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = removeProfilePicture;