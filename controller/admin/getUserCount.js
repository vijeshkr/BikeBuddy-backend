const userModel = require('../../models/userModel');

// Get users by role controller
const getUserCount = async (req, res) => {
    const { role } = req.params;
    const userRole = req.userRole;

    try {
        // Checking current user is admin or not
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can fetch users data',
                success: false
            });
        }

        // Validate role
        if (!['customer', 'mechanic', 'admin'].includes(role)) {
            return res.status(400).json({
                message: 'Invalid role',
                success: false
            });
        }

        // Find user by role
        const users = await userModel.find({ role }).select('name');

        const userCount = users.length;

        // Send users
        res.status(200).json({
            message: 'Users',
            success: true,
            data: userCount
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = getUserCount;