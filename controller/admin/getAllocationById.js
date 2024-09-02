const allocationModel = require('../../models/allocationModel');

const getAllocationById = async (req, res) => {
    const userRole = req.userRole;
    const allocationId = req.params.allocationId;

    try {
        // Checking current user is an admin or not
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can access this resource',
                success: false
            });
        }

        // Find allocations based on allocation ID and populate the bookingId and partsUsed fields
        const allocation = await allocationModel.findById(allocationId)
            .populate({
                path: 'bookingId',
                populate: [
                    { path: 'vehicleId' },
                    { path: 'serviceType' },
                    { path: 'customerId', select: 'name' }
                ]
            })
            .populate({
                path: 'partsUsed.partId',
            }).populate({
                path: 'mechanicId',  // Populate mechanicId reference
                select: 'name' // Select only the 'name' field from mechanicId
            })
            .sort({ createdAt: -1 });

        // Check if allocations exist for the given mechanic ID
        if (!allocation) {
            return res.status(404).json({
                message: 'No allocations found',
                success: false
            });
        }

        // Respond with the allocations data
        res.status(200).json({
            message: 'Allocations retrieved successfully',
            success: true,
            data: allocation
        });

    } catch (error) {
        console.error('Error fetching allocations by mechanicId: ', error);
        // Handle server errors
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = getAllocationById;
