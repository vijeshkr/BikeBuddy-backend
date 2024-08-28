const bookingModel = require('../../models/bookingModel');

const getAllBookings = async (req, res) => {
    const userRole = req.userRole;

    try {

        // Checking current user is admin or not
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can get all bookings',
                success: false
            });
        }

        // Find all bookings and populate fields
        const bookings = await bookingModel.find()
            .populate([
                { path: 'vehicleId' },
                { path: 'serviceType' },
                { path: 'customerId', select: '-password' }, // Exclude password from customerId
                { path: 'allocation' }
            ])
            .sort({ bookingDate: -1 });

        // Populate mechanicId within allocation
        await bookingModel.populate(bookings, {
            path: 'allocation.mechanicId',
            select: '-password' // Exclude password from mechanicId if needed
        });

        // Respond with the current bookings
        res.status(200).json({
            message: 'All bookings retrieved successfully',
            success: true,
            data: bookings
        });

    } catch (error) {
        console.error('Error fetching all bookings: ', error);
        // Handle server errors
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }

}

module.exports = getAllBookings;