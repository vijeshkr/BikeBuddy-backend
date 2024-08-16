const notificationModel = require('../../models/notificationModel');

const getNotifications = async (req, res) => {
    const userId = req.userId;

    try {
        // Fetch notifications from the database based on the user id in the descending order
        const notifications = await notificationModel.find({ userId }).sort({ createdAt: -1 });

        // Send a successfull response with notifications data
        res.status(200).json({
            message: 'Notification retrieved successfully',
            success: true,
            data: notifications
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }

}

module.exports = getNotifications;