const { getSocketIdByUserId, io } = require('../../config/socket');
const bookingModel = require('../../models/bookingModel');
const customerVehicleModel = require('../../models/customerVehicleModel');
const notificationModel = require('../../models/notificationModel');
const userModel = require('../../models/userModel');

const addNewBooking = async (req, res) => {
    const { customerId, vehicleId, bookingDate, serviceType, pickUp, description } = req.body;

    try {
        // Validate that all required fields are present
        if (!customerId || !vehicleId || !bookingDate || !serviceType) {
            return res.status(400).json({
                message: 'All required fields must be filled',
                success: false
            });
        }

        // Check if the vehicle is already booked or not
        const bookings = await bookingModel.find({ vehicleId });

        if (bookings.length > 0) {
            const isConflict = bookings.some((booking) => {
                return booking.status !== 'Paid' && booking.status !== 'Cancelled';
            });

            if (isConflict) {
                return res.status(409).json({
                    message: 'Already booked the service',
                    success: false
                });
            }
        }


        // Create a new booking document
        const newBooking = new bookingModel({
            customerId,
            vehicleId,
            bookingDate,
            serviceType,
            pickUp,
            description
        });

        // Save the booking
        await newBooking.save();

        // Find customer vehicle by vehicleId
        const customerVehicle = await customerVehicleModel.findById(vehicleId);

        // Check and update free service eligibility and count
        if (customerVehicle.freeServiceEligibility) {
            // Increment free service count if eligibility is true
            customerVehicle.freeServiceCount += 1;

            // If the free service count reaches or exceeds 3, disable further free services
            if (customerVehicle.freeServiceCount >= 3) {
                customerVehicle.freeServiceEligibility = false;
            }

            // Save updated customer vehicle details
            await customerVehicle.save();
        }

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
                message: `${bookingData?.customerId?.name} has booked a service for their vehicle.`,
                link: '/admin/admin-booking'
            });
            const socketId = getSocketIdByUserId(admin._id.toString());
            if (socketId) {
                // Send new booking notification to admin
                io.to(socketId).emit('newNotification', notification);
                // TODO: Send real time booking updates to admin like this
                // io.to(socketId).emit('newLeaveRequest', leaveWithMechanic);
            }
        }

        // Data to return
        const data = {
            customerVehicle,
            bookingData
        }

        // Respond with success message and booking data
        res.status(200).json({
            message: 'Booking created successfully',
            success: true,
            data: data
        });

    } catch (error) {
        console.error('Error while service booking', error);
        res.status(500).json({
            message: 'Inernal server error',
            success: false
        });
    }
}

module.exports = addNewBooking;