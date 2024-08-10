const leaveModel = require('../../models/leaveModel');

const getAllLeaves = async (req, res) => {

    const userRole = req.userRole;

    try {

        // Checking current user is admin or not
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can fetch all leaves',
                success: false
            });
        }

        const leaves = await leaveModel.find();

        if (leaves.length === 0) {
            return res.status(404).json({
                message: 'No leave history available',
                success: false
            });
        } else {
            return res.status(200).json({
                message: 'Leaves',
                success: true,
                data: leaves
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = getAllLeaves;