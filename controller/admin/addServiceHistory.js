const allocationModel = require('../../models/allocationModel');
const bookingModel = require('../../models/bookingModel');
const serviceHistoryModel = require('../../models/serviceHistory');

const addServiceHistory = async (req, res) => {

    // Extract the data from the request body
    const { allocation, pickUpCharge, breakdownCharge, GST, serviceName, serviceCharge, extraWorks } = req.body;
    const userRole = req.userRole;

    try {
        // Checking current user is admin or not
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can create service history',
                success: false
            });
        }

        // Create a new service history instance with the provided data
        const serviceHistory = new serviceHistoryModel({
            allocation,
            pickUpCharge,
            breakdownCharge,
            GST,
            serviceName,
            serviceCharge,
        });

        // Process each work
        const processedExtraWorks = extraWorks.map((work) => {

            return {
                workId: work.workId,
                workName: work.workName,
                price: work.price,
            };
        });

        // Update the service history with new data
        serviceHistory.extraWorks = processedExtraWorks;

        // Save the new service history record to the database
        await serviceHistory.save();

        // Find the booking by id
        const booking = await allocationModel.findById(allocation).populate('bookingId');

        // If the booking not found return an error
        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found',
                success: false
            });
        }

        // Update the booking status
        if (booking.bookingId) {
            booking.bookingId.status = 'Unpaid';
            await booking.bookingId.save(); // Ensure to save the bookingId document
        }

        // Send response with success message and the created service history
        res.status(200).json({
            message: 'Service history created',
            success: true,
            data: serviceHistory
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error during registration',
            success: false
        });
    }

}

module.exports = addServiceHistory;