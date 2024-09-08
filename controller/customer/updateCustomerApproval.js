const { getSocketIdByUserId, io } = require('../../config/socket');
const allocationModel = require('../../models/allocationModel');
const notificationModel = require('../../models/notificationModel');

const updateCustomerApproval = async (req, res) => {
    const { id } = req.params;
    const { customerApproval } = req.body;

    try {
        // Check if the approval status is valid
        if (!['Approved', 'Rejected'].includes(customerApproval)) {
            return res.status(400).json({
                message: 'Invalid approval status',
                success: false
            });
        }

        // Find allocation by ID and update customerApproval field
        const updatedAllocation = await allocationModel.findByIdAndUpdate(
            id,
            { customerApproval },
            // Return the updated document
            { new: true }
        );

        if (!updatedAllocation) {
            return res.status(404).json({
                message: 'Allocation not found',
                success: false
            });
        }

        // Create notification for the mechanic
        const notification = await notificationModel.create({
            userId: updatedAllocation?.mechanicId,
            message: `Additional work request has been ${customerApproval.toLowerCase()} by the customer.`,
            link: '/mechanic'
        });

        const socketId = getSocketIdByUserId(updatedAllocation?.mechanicId.toString());

        if (socketId) {
            // Send new customer approval or rejection for additional works notification to mechanic
            io.to(socketId).emit('newNotification', notification);
            // TODO: Send real time customer approval or rejection updates to mechanic like this
            // io.to(socketId).emit('leaveStatusUpdate', updatedLeave);
        }

        res.status(200).json({
            message: 'Customer approval has updated',
            success: true,
            data: updatedAllocation
        });

    } catch (error) {
        console.error('Error fetching current bookings: ', error);
        // Handle server errors
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = updateCustomerApproval;