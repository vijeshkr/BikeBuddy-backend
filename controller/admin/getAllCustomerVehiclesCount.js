const customerVehicleModel = require('../../models/customerVehicleModel');

const getAllCustomerVehiclesCount = async (req, res) => {
    const userRole = req.userRole;

    try {
        // Checking the user is admin or not
        if(userRole !== 'admin'){
            return res.status(403).json({
                message: 'No permission',
                success: false
            });
        }

        // Fetch all vehicles from the database
        const vehicles = await customerVehicleModel.find();

        const count = vehicles.length;

        // Send a successfull response with retrieved data
        res.status(200).json({
            message: 'Vehicles fetched successfully',
            success: true,
            data: count
        });
        
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
          });
    }
}

module.exports = getAllCustomerVehiclesCount;