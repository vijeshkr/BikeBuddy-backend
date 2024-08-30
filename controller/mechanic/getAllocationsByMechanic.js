const allocationModel = require('../../models/allocationModel');

const getAllocationsByMechanic = async (req, res) => {
    const userRole = req.userRole;
    const mechanicId = req.params.mechanicId;

    try {
        // Checking current user is a mechanic or not
        if(userRole !== 'mechanic'){
            return res.status(403).json({
                message: 'Only mechanics can access this resource',
                success: false
            });
        }

        // Find allocations based on mechani ID and populate the bookingId field
        const allocations = await allocationModel.find({ mechanicId })
        .populate({
            path: 'bookingId',
            populate: [
                {path: 'vehicleId'},
                {path: 'serviceType'},
                {path: 'customerId', select: '-password'},
            ]
        }).sort({createdAt: -1});

        // Check if allocations exist for the given mechanic ID
        if(allocations.length === 0){
            return res.status(404).json({
                message: 'No allocations found',
                success: false
            });
        }

        // Respond with the allocations data
        res.status(200).json({
            message: 'Allocations retrieved successfully',
            success: true,
            data: allocations
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

module.exports = getAllocationsByMechanic;