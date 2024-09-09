const bookingModel = require('../../models/bookingModel');
const customerVehicleModel = require('../../models/customerVehicleModel');

const cancelBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        // Find the booking by id
        const booking = await bookingModel.findById(bookingId);

        // If the booking not found return an error
        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found',
                success: false
            });
        }

        // Check if the booking is eligible for cancellation (status must be "Pending")
        if (booking.status !== 'Unallocated') {
            return res.status(400).json({
                message: 'Cannot cancel booking',
                success: false
            });
        }

        // Find the customer vehicle associated with this booking
        const customerVehicle = await customerVehicleModel.findById(booking.vehicleId);

        if (!booking?.breakdown) {
            // Reverse free service if applicable
            if (customerVehicle.freeServiceCount > 0) {
                // Decrement free service count
                customerVehicle.freeServiceCount -= 1;

                // Re-enable free service eligibility if the count drops below 3
                if (customerVehicle.freeServiceCount < 3) {
                    customerVehicle.freeServiceEligibility = true;
                }

                // Save updated vehicle information
                await customerVehicle.save();
            }
        }

        // Update the booking status to "Cancelled"
        booking.status = 'Cancelled';
        await booking.save();

        // Data to return
        const data = {
            customerVehicle,
            booking
        }

        // Respond with success message and updated booking data
        res.status(200).json({
            message: 'Booking cancelled successfully',
            success: true,
            data: data
        });

    } catch (error) {
        console.error('Error canceling booking:', error);
        // Handle server errors
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = cancelBooking;