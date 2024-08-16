const notificationModel = require('../../models/notificationModel');

const markAllAsRead = async (req, res) => {
    const userId = req.userId;
    try {
        // Update all notifications for the user unread to read
        await notificationModel.updateMany({ userId, read: false }, { $set: { read: true } });

        // Send a successfull response
        res.status(200).json({
            message: 'All notifications marked as read',
            success: true
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = markAllAsRead;