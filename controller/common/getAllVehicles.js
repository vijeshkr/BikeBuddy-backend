const vehiclesModel = require('../../models/vehiclesModel');

const getAllVehicles = async (req, res) => {
    try {
        // Fetch all vehicles from the database
        const allVehicles = await vehiclesModel.find();

        // Send a successfull response with retrieved data
        return res.status(200).json({
            message: 'All vehicles',
            success: true,
            data: allVehicles
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = getAllVehicles;