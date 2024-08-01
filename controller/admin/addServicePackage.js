const servicePackageModel = require('../../models/servicePackageModel');

const addServicePackage = async (req, res) => {
    const { packageName, price, description, suitable } = req.body;
    const userRole = req.userRole;

    try {
        // Checking current user is admin or not
        if(userRole !== 'admin'){
            return res.status(403).json({
                message: 'Only admin can add new packages',
                success: false
            });
        }

        // Checking all fields filled or not
        if (!packageName || !price || !description || !suitable) {
            return res.status(422).json({
                message: 'Please fill all fields',
                success: false
            });
        }

        // Create new package
        const newServicePackage = new servicePackageModel({
            packageName,
            price,
            description,
            suitable
        });

        // Save package
        const savedPackage = await newServicePackage.save();
        res.status(200).json({
            message: 'Service package created',
            success: true,
            data: savedPackage
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = addServicePackage;