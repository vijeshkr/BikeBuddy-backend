const vehiclesModel = require('../../models/vehiclesModel');

const getAllVehicles = async (req, res) => {
    try {
        const allVehicles = await vehiclesModel.find();
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