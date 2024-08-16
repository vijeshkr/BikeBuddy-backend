const { normalizeDate } = require('../../common/utils');
const leaveModel = require('../../models/leaveModel');
const userModel = require('../../models/userModel');
const notificationModel = require('../../models/notificationModel');
const { io } = require('../../config/socket');

const applyLeave = async (req, res) => {
    const userId = req.userId;
    const { startDate, endDate, reason, halfDay } = req.body;

    try {
        // Validate request data
        if (!startDate || !endDate || !reason) {
            return res.status(400).json({
                message: 'Date and reason required',
                success: false
            });
        }

        // Convert dates to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Check if endDate is less than startDate
        if (end < start) {
            return res.status(400).json({
                message: 'End date cannot be before start date',
                success: false
            });
        }

        // Check if halfDay is true and startDate and endDate are the same day
        if (halfDay && normalizeDate(start) !== normalizeDate(end)) {
            return res.status(400).json({
                message: 'Date mismatch',
                success: false
            });
        }

        // Check if halfDay is false and startDate and endDate are the same day
        if (!halfDay && normalizeDate(start) === normalizeDate(end)) {
            return res.status(400).json({
                message: 'Start date and end date are same',
                success: false
            });
        }

        // Create new leave request
        const newLeave = new leaveModel({
            mechanicId: userId,
            reason,
            startDate,
            endDate,
            halfDay,
            status: 'Pending'
        });

        // Calculate days
        newLeave.days = newLeave.calculateDays();

        // Save the leave request
        const savedLeave = await newLeave.save();

        // Populate the mechanicId field to get the mechanic's details
        const leaveWithMechanic = await leaveModel.findById(savedLeave._id).populate('mechanicId');

        // Find all admin
        const admins = await userModel.find({ role: 'admin' });

        // Create notification for each admin
        for (const admin of admins) {
            await notificationModel.create({
                userId: admin._id,
                message: `New leave application from mechanic ${leaveWithMechanic.mechanicId.name}.`,
                link: '/admin/admin-mechanics/leave-requests'
            });
        }

        // Send new leave to admin leave page using socket io
        io.emit('newLeaveRequest', leaveWithMechanic);

        res.status(201).json({
            message: 'Leave request submitted',
            success: true,
            data: leaveWithMechanic
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = applyLeave;