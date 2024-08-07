const sparePartModel = require('../../models/sparePartModel');
const fs = require('fs');
const path = require('path');

const deleteSpare = async (req, res) => {
    const spareId = req.params.spareId;
    const userRole = req.userRole;
    try {
        // Checking current user is admin or not
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can delete spare parts',
                success: false
            });
        }

        // Find spare by id
        const spare = await sparePartModel.findById(spareId);
        if (!spare) {
            return res.status(404).json({
                message: 'Spare not found',
                success: false
            });
        }

        // Construct the file path for the image
        const filePath = path.join('images', spare.image);

        // Delete the image file if it exists
        if (spare.image) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting spare part image:', err);
                } else {
                    console.log('Spare part image deleted successfully');
                }
            });
        }

        // Find and delete spare by id
        const deletedSpare = await sparePartModel.findByIdAndDelete(spareId);

        return res.status(200).json({
            message: 'spare successfully deleted',
            success: true,
            data: deletedSpare
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = deleteSpare;