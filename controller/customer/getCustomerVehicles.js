const customerVehicleModel = require('../../models/customerVehicleModel');

// Fetch vehicles by customer id
const getCustomerVehicles = async (req, res) => {
    const { customerId } = req.params;

    try {
        // Fetch vehicles for the specific customer id
        const vehicles = await customerVehicleModel.find({ customer: customerId}).populate('customer');

        if(vehicles.length === 0) {
            return res.status(404).json({
                message: 'No vehicles found for this customer',
                success: false
            });
        }

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