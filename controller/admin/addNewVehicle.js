const vehiclesModel = require('../../models/vehiclesModel');

const addNewVehicle = async (req, res) => {
    const userRole = req.userRole;
    const { name, image } = req.body;
    try {
        // Checking current user is admin or not
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can add vehicles',
                success: false
            });
        }

        // Checking all fields are filled or not
        if (!name || !image) {
            return res.status(422).json({
                message: 'Please fill all fields',
                success: false
            });
        }

        // Create new vehicle
        const newVehicle = new vehiclesModel({
            name,
            image
        });

        // Save vehicle
        await newVehicle.save();

        res.status(200).json({
            message: 'New vehicle created',
            success: true,
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = addNewVehicle;