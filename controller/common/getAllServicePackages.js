const servicePackageModel = require('../../models/servicePackageModel');

const getAllServicePackages = async (req, res) => {
    try {
        // Fetch all service packages from the database
        const servicePackages = await servicePackageModel.find();

        // Send a successfull response with retireved data
        return res.status(200).json({
            message: 'All service packages',
            success: true,
            data: servicePackages
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }

}

module.exports = getAllServicePackages;