const bookingModel = require('../../models/bookingModel');

const getCurrentBooking = async (req, res) => {
    const { customerId } = req.params;

    try {
        // Find all bookings related to the customer that are not "Completed" or "Cancelled"
        const bookings = await bookingModel.find({
            customerId,
            status: { $nin: ['Completed', 'Cancelled'] }
        }).populate('vehicleId serviceType').sort({ createdAt: -1 });

        // Respond with the current bookings
        res.status(200).json({
            message: 'Current bookings retrieved successfully',
            success: true,
            data: bookings
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

module.exports = getCurrentBooking;