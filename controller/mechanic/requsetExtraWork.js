const { getSocketIdByUserId, io } = require('../../config/socket');
const allocationModel = require('../../models/allocationModel');
const bookingModel = require('../../models/bookingModel');
const notificationModel = require('../../models/notificationModel');

const requestExtraWork = async (req, res) => {
    const { id } = req.params;
    const { description, amount } = req.body;

    try {

        // Check if the description and amount available or not
        if (!description && !amount) {
            return res.status(422).json({
                message: 'Please fill the fields',
                success: false
            });
        }

        // Find the allocation by id and update the relevant fields
        const allocation = await allocationModel.findByIdAndUpdate(
            id,
            {
                extraWorkDescription: description,
                extraWorkEstimationAmount: amount,
                customerApproval: 'Pending'
            },
            { new: true } // This option returns the updated document
        );

        if (!allocation) {
            return res.status(404).json({
                message: 'Allocation not found',
                success: false
            });
        }

        const booking = await bookingModel.findById(allocation?.bookingId)

        // Create notification for the customer
        const notification = await notificationModel.create({
            userId: booking?.customerId,
            message: `There’s a request for additional work on your vehicle. Check details.`,
            link: '/'
        });

        const socketId = getSocketIdByUserId(booking?.customerId.toString());

        if (socketId) {
            // Send new additional works notification to customer
            io.to(socketId).emit('newNotification', notification);
            // TODO: Send real time additional works updates to customer like this
            // io.to(socketId).emit('leaveStatusUpdate', updatedLeave);
        }

        res.status(200).json({
            message: 'Extra work requested successfully',
            success: true,
            data: allocation
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }

}

module.exports = requestExtraWork;