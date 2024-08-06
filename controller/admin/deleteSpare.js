const sparePartModel = require('../../models/sparePartModel');

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

        // Find and delete spare by id
        const deletedSpare = await sparePartModel.findByIdAndDelete(spareId);

        if (!deletedSpare) {
            return res.status(404).json({
                message: 'Spare not found',
                success: false
            });
        }

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