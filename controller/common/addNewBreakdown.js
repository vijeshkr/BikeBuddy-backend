const { getSocketIdByUserId, io } = require('../../config/socket');
const bookingModel = require('../../models/bookingModel');
const notificationModel = require('../../models/notificationModel');
const userModel = require('../../models/userModel');

const addNewBreakdown = async (req, res) => {
    const { customerId, vehicleId, place, phone, description, breakdown, bookingDate } = req.body;

    try {
        // Validate that all required fields are present
        if (!customerId || !vehicleId || !bookingDate || !phone || !place) {
            return res.status(400).json({
                message: 'All required fields must be filled',
                success: false
            });
        }

        // Create a new booking document
        const newBooking = new bookingModel({
            customerId,
            vehicleId,
            place,
            phone,
            description,
            breakdown,
            bookingDate,
        });

        // Save the booking
        await newBooking.save();

        const bookingData = await bookingModel.findById(newBooking._id)
            .populate({
                path: 'customerId',
                select: '-password'
            })
            .populate('vehicleId')
            .populate('serviceType');

        // Find all admin
        const admins = await userModel.find({ role: 'admin' });

        // Create notification for each admin
        for (const admin of admins) {
            const notification = await notificationModel.create({
                userId: admin._id,
                message: `${bookingData?.customerId?.name} has booked a breakdown for their vehicle.`,
                link: '/admin/admin-booking'
            });
            const socketId = getSocketIdByUserId(admin._id.toString());
            if (socketId) {
                // Send new breakdown notification to admin
                io.to(socketId).emit('newNotification', notification);
                // TODO: Send real time breakdown updates to admin like this
                // io.to(socketId).emit('newLeaveRequest', leaveWithMechanic);
            }

        }

        // Respond with success message and booking data
        res.status(200).json({
            message: 'Booking created successfully',
            success: true,
            data: bookingData
        });

    } catch (error) {
        console.error('Error while service booking', error);
        res.status(500).json({
            message: 'Inernal server error',
            success: false
        });
    }
}

module.exports = addNewBreakdown;