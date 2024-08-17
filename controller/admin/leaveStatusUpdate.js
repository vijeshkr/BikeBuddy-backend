const leaveModel = require('../../models/leaveModel');
// const { sendLeaveStatusMail } = require('../../common/utils');
const { io } = require('../../config/socket');
const notificationModel = require('../../models/notificationModel');
const { getSocketIdByUserId } = require('../../config/socket');

const leaveStatusUpdate = async (req, res) => {
    const leaveId = req.params.id;
    const { status } = req.body;
    const userRole = req.userRole;

    try {
        // Check if the user is an admin
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can update the leave status',
                success: false
            });
        }

        // Validate the status value
        const validateStatus = ['Approved', 'Rejected'];
        if (!validateStatus.includes(status)) {
            return res.status(403).json({
                message: 'Invalid status value',
                success: false
            });
        }

        // Find and update the leave request
        const leave = await leaveModel.findById(leaveId).populate('mechanicId');
        if (!leave) {
            return res.status(404).json({
                message: 'Leave request not found',
                success: false
            });
        }

        // Update the status field
        leave.status = status;
        const updatedLeave = await leave.save();

        // Create notification for the mechanic
        const notification = await notificationModel.create({
            userId: leave.mechanicId._id,
            message: `Your leave request has been ${status}.`,
            link: '/mechanic/mechanic-leave'
        });

        const socketId = getSocketIdByUserId(leave.mechanicId._id.toString());

        console.log(leave.mechanicId._id)

        if (socketId) {
            // Send new leave notification to mechanic
            io.to(socketId).emit('newNotification', notification);
            // Send updated leave to the mechanic leave history using socket io
            io.to(socketId).emit('leaveStatusUpdate', updatedLeave);
        }

        // Send email
        // await sendLeaveStatusMail(
        //     leave.mechanicId.email,
        //     status,
        //     leave.startDate,
        //     leave.endDate
        // );

        return res.status(200).json({
            message: 'Leave status updated successfully',
            success: true,
            data: updatedLeave
        });

    } catch (error) {
        console.error('Error updating leave status:', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = leaveStatusUpdate;