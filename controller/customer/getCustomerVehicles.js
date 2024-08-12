const customerVehicleModel = require('../../models/customerVehicleModel');

// Fetch vehicles by customer id
const getCustomerVehicles = async (req, res) => {
    const { customerId } = req.params;

    try {
        // Fetch vehicles for the specific customer id
        const vehicles = await customerVehicleModel.find({ customer: customerId}).populate('modelName');

        // If no vehicles found, respond with 404
        if(vehicles.length === 0) {
            return res.status(404).json({
                message: 'No vehicles found for this customer',
                success: false
            });
        }

        // If vehicles are found, respond with 200 and the data
        res.status(200).json({
            message: 'Vehicles fetched successfully',
            success: true,
            data: vehicles
        });
        
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = getCustomerVehicles;