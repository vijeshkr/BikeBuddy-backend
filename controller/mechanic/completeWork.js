const { getSocketIdByUserId, io } = require('../../config/socket');
const allocationModel = require('../../models/allocationModel');
const bookingModel = require('../../models/bookingModel');
const notificationModel = require('../../models/notificationModel');
const sparePartModel = require('../../models/sparePartModel');
const userModel = require('../../models/userModel');

const completeWork = async (req, res) => {
    const { partsUsed, serviceAdvice } = req.body;
    const { id } = req.params;
    try {
        // Find the allocation by ID
        const allocation = await allocationModel.findById(id).populate({
            path: 'mechanicId',
            select: '-password'
        });

        if (!allocation) {
            return res.status(404).json({
                message: 'Allocation not found',
                success: false,
            });
        }

        // Stock updation
        // Loop through each part and reduce the stock
        for (const part of partsUsed) {
            const sparePart = await sparePartModel.findById(part.partId);

            // If part exists and stock is sufficient
            if (sparePart && sparePart.stock >= part.quantity) {
                sparePart.stock -= part.quantity; // Decrease the stock
                await sparePart.save(); // Save the updated part
            } else {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for part: ${sparePart.itemName}`
                });
            }
        }

        // Fetch booking id from the allocation
        const bookingId = allocation.bookingId.toString();

        // Initialize the total parts cost
        let totalPartsPrice = 0;

        // Process each part to calculate the total cost
        const processedPartsUsed = partsUsed.map((part) => {
            // Calculate the total cost for this part
            const totalPartCost = part.price * part.quantity;
            totalPartsPrice += totalPartCost;

            return {
                partId: part.partId,
                partName: part.partName,
                quantity: part.quantity,
                totalPartCost,
            };
        });

        // Update the allocation with new data
        allocation.partsUsed = processedPartsUsed;
        allocation.totalPartsPrice = totalPartsPrice;
        allocation.serviceAdvice = serviceAdvice;

        // Save the updated allocation
        await allocation.save();

        // Find the booking by id
        const booking = await bookingModel.findById(bookingId);

        // If the booking not found return an error
        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found',
                success: false
            });
        }

        // Update the booking status
        booking.status = 'Completed';
        await booking.save();

        // Find all admin
        const admins = await userModel.find({ role: 'admin' });

        // Create notification for each admin
        for (const admin of admins) {
            const notification = await notificationModel.create({
                userId: admin._id,
                message: `${allocation?.mechanicId?.name} has completed the assigned job.`,
                link: '/admin/admin-booking'
            });
            const socketId = getSocketIdByUserId(admin._id.toString());
            if (socketId) {
                // Send new work completion notification to admin
                io.to(socketId).emit('newNotification', notification);
                // TODO: Send real time work completion updates to admin like this
                // io.to(socketId).emit('newLeaveRequest', leaveWithMechanic);
            }

        }

        // Send a successful response with the updated allocation data
        return res.status(200).json({
            message: 'Work completion recorded successfully',
            success: true,
            data: allocation,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
}

module.exports = completeWork;