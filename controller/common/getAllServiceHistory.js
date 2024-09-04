const serviceHistoryModel = require('../../models/serviceHistoryModel');

const getAllServiceHistory = async (req, res) => {
    const userId = req.userId;
    const userRole = req.userRole;

    try {
        // Fetch service history with population
        const serviceHistories = await serviceHistoryModel
            .find()
            .populate({
                path: 'allocation',
                populate: [
                    {
                        path: 'bookingId',
                        populate: [
                            {
                                path: 'vehicleId'
                            },
                            {
                                path: 'serviceType'
                            },
                            {
                                path: 'customerId'
                            },
                        ]
                    },
                    {
                        path: 'mechanicId',
                        select: 'name'
                    }
                ]
            });

        // Filter results based on userRole
        let filteredHistories = serviceHistories;

        if (userRole === 'customer') {
            filteredHistories = serviceHistories.filter(history =>
                history.allocation.bookingId.customerId._id.toString() === userId
            );
        }

        // If no service history found, return 404 response
        if (filteredHistories.length === 0) {
            return res.status(404).json({
                message: 'Service history not found',
                success: false,
            });
        }

        // Respond with filtered service history
        res.status(200).json({
            message: 'Service History retrieved successfully',
            success: true,
            data: filteredHistories,
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
}

module.exports = getAllServiceHistory;
