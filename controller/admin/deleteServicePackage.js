const servicePackageModel = require('../../models/servicePackageModel');

const deleteServicePackage = async (req, res) => {
    const { packageId } = req.body;
    const userRole = req.userRole;
    
    try {
        // Checking current user is admin or not
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can delete packages',
                success: false
            });
        }

        // Find and delete the package by id
        const deletedPackage = await servicePackageModel.findByIdAndDelete(packageId);

        // If no deleted package respond with 404
        if (!deletedPackage) {
            return res.status(404).json({
                message: 'Package not found',
                success: false
            });
        }

        return res.status(200).json({
            message: 'Package successfully deleted',
            success: true,
            data: deletedPackage
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = deleteServicePackage;