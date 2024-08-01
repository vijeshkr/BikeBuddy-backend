const servicePackageModel = require('../../models/servicePackageModel');

const updateServicePackage = async (req, res) => {

    const { _id, packageName, price, description, suitable } = req.body;
    const userRole = req.userRole;

    try {
        // Checking current user is admin or not
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can update packages',
                success: false
            });
        }

        // Find the package by id
        const package = await servicePackageModel.findById(_id);

        if (!package) {
            return res.status(404).json({
                message: 'Package not found',
                success: false
            });
        }

        // Has changed function to check if there any changes
        const hasChanged = (
            package.packageName !== packageName ||
            package.price !== price ||
            package.description !== description ||
            package.suitable !== suitable
        );

        if (!hasChanged) {
            return res.status(200).json({
                message: 'No changes detected',
                success: false
            })
        }

        // Update the package
        package.packageName = packageName;
        package.price = price;
        package.description = description;
        package.suitable = suitable;

        // Save package
        const savedPackage = await package.save();
        res.status(200).json({
            message: 'Service package updated',
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

module.exports = updateServicePackage;