const { getSocketIdByUserId, io } = require('../../config/socket');
const allocationModel = require('../../models/allocationModel');
const bookingModel = require('../../models/bookingModel');
const notificationModel = require('../../models/notificationModel');

const allocateWork = async (req, res) => {
    const userRole = req.userRole;
    const { bookingId, mechanicId } = req.body;

    try {

        // Checking current user is admin or not
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can allocate work',
                success: false
            });
        }

        // Allocate work to mechanic
        const allocation = new allocationModel({
            bookingId,
            mechanicId
        });

        // Save allocation
        const savedAllocation = await allocation.save();

        // Update booking status to 'Allocated' and set the allocation reference
        await bookingModel.findByIdAndUpdate(bookingId, {
            status: 'Allocated',
            allocation: savedAllocation._id
        });

        // Fetch the updated booking and populate fields
        const updatedBooking = await bookingModel.findById(bookingId)
            .populate([
                { path: 'vehicleId' },
                { path: 'serviceType' },
                { path: 'customerId', select: '-password' }, // Exclude password from customerId
                { path: 'allocation' }
            ]);

        // Populate mechanicId within the allocation field
        await bookingModel.populate(updatedBooking, {
            path: 'allocation.mechanicId',
            select: '-password' // Exclude password from mechanicId if needed
        });

        // Get populated allocation
        const allocatedJob = await allocationModel.findById( savedAllocation._id )
        .populate({
            path: 'bookingId',
            populate: [
                {path: 'vehicleId'},
                {path: 'serviceType'},
                {path: 'customerId', select: '-password'},
            ]
        });

        // Create notification for the mechanic
        const notification = await notificationModel.create({
            userId: mechanicId,
            message: `A new job has been assigned to you.`,
            link: '/mechanic'
        });

        const socketId = getSocketIdByUserId(mechanicId.toString());

        if (socketId) {
            // Send new allocation notification to mechanic
            io.to(socketId).emit('newNotification', notification);
            // Send real time allocation updates to the allocated mechani
            io.to(socketId).emit('jobAllocation', allocatedJob);
        }

        // Respond with success message and populated booking
        res.status(200).json({
            message: 'Work allocated successfully',
            success: true,
            data: updatedBooking
        });

    } catch (error) {
        console.error('Error allocate work: ', error);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = allocateWork;