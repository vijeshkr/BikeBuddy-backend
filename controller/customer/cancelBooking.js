const bookingModel = require('../../models/bookingModel');

const cancelBooking = async (req, res) => {
    const { bookingId } = req.params;

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

        // Check if the booking is eligible for cancellation (status must be "Pending")
        if(booking.status !== 'Unallocated'){
            return res.status(400).json({
                message: 'Cannot cancel booking',
                success: false
            });
        }

        // Update the booking status to "Cancelled"
        booking.status = 'Cancelled';
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

module.exports = cancelBooking;