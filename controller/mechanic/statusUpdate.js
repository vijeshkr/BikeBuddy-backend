const bookingModel = require('../../models/bookingModel');

const statusUpdate = async (req, res) => {
    const { bookingId, status } = req.body;

    try {
        // Find the booking by id
        const booking = await bookingModel.findById(bookingId);

        // If the booking not found return an error
        if(!booking){
            return res.status(404).json({
                message: 'Booking not found',
                success: false
            });
        }

        // Update the booking status
        booking.status = status;
        await booking.save();

        // Respond with success message and updated booking data
        res.status(200).json({
            message: 'Booking cancelled successfully',
            success: true,
            data: booking
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

module.exports = statusUpdate;