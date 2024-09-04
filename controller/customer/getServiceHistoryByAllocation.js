const serviceHistoryModel = require('../../models/serviceHistoryModel');

const getServiceHistoryByAllocation = async (req, res) => {
    // Extract allocation ID from the request parameters
    const { allocationId } = req.params;

    try {
        // Find the service history that matches the provided allocation ID
        const serviceHistory = await serviceHistoryModel
            .findOne({ allocation: allocationId })
            .populate({
                path: 'allocation',
                populate: {
                    path: 'bookingId',
                    path: 'partsUsed.partId',
                }
            });

        // If no service history found, return 404 response
        if (!serviceHistory) {
            return res.status(404).json({
                message: 'Service history not found',
                success: false,
            });
        }

        // If the service history found response with success message and data
        res.status(200).json({
            message: 'Service History retrieved successfully',
            success: true,
            data: serviceHistory,
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }

}

module.exports = getServiceHistoryByAllocation;