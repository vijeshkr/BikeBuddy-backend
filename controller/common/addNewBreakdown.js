const bookingModel = require('../../models/bookingModel');

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