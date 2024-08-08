const customerVehicleModel = require('../../models/customerVehicleModel');

const addCustomerVehicle = async (req, res) => {
    const { customer, modelName, registrationNumber, registrationDate } = req.body;

    try {
        // Check all fields are filled or not
        if (!customer || !modelName || !registrationNumber || !registrationDate) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false
            });
        }

        // Create new vehicle
        const vehicle = new customerVehicleModel({
            customer,
            modelName,
            registrationNumber,
            registrationDate
        });

        // Check and update free service eligibility before saving
        await vehicle.updateFreeServiceEligibility();

        await vehicle.save();

        res.status(200).json({
            message: 'Vehicle created successfully',
            success: true,
            data: vehicle
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = addCustomerVehicle;