const customerVehicleModel = require('../../models/customerVehicleModel');

const getAllCustomerVehicles = async (req, res) => {
    const userRole = req.userRole;

    try {
        // Checking the user is admin or not
        if(userRole !== 'admin'){
            return res.status(403).json({
                message: 'No permission',
                success: false
            });
        }

        const vehicles = await customerVehicleModel.find().populate('customer');

        res.status(200).json({
            message: 'Vehicles fetched successfully',
            success: true,
            data: vehicles
        });
        
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
          });
    }
}

module.exports = getAllCustomerVehicles;