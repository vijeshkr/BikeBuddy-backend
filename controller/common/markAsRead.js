const notificationModel = require('../../models/notificationModel');

const markAsRead = async (req, res) => {
    const { notificationId } = req.params;

    try {
        // Find the notification by it's id
        const notification = await notificationModel.findById( notificationId );

        // If notification not found, send a 404 response
        if(!notification){
            return res.status(404).json({
                message: 'Notification not found',
                success: false
            });
        }

        // Update the notification to mark it as read
        notification.read = true;
        await notification.save();

        // Send a successfull response with updated notification data
        res.status(200).json({
            message: 'Notification marked as read',
            success: true,
            data: notification
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }

}

module.exports = markAsRead;