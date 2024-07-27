const userModel = require('../../models/userModel');

const userDetails = async (req, res) => {
    try {
        
        // Fetch the user details from the DB using user id
        const user = await userModel.findById(req.userId);

        // If the user not found respond with a 404 status code
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        const { password: userPassword, ...otherData } = user.toObject();

        // Respond with user data and success message
        return res.status(200).json({
            message: 'User details',
            success: true,
            data: otherData
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Inernal server error',
            success: false
        });
    }
}

module.exports = userDetails;