const bookingModel = require('../../models/bookingModel');

const addNewBooking = async (req, res) => {
    const { customerId, vehicleName, bookingDate, serviceType, pickUp, description } = req.body;

    try {
        // Validate that all required fields are present
        if(!customerId || !vehicleName || !bookingDate || !serviceType){
            return res.status(400).json({
                message: 'All required fields must be filled',
                success: false
            });
        }

        // Create a new booking document
        const newBooking = new bookingModel({
            customerId,
            vehicleName,
            bookingDate,
            serviceType,
            pickUp,
            description
        });

        // Save the booking
        await newBooking.save();

        // Respond with success message and booking data
        res.status(200).json({
            message: 'Booking created successfully',
            success: true,
            data: newBooking
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