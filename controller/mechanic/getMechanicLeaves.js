const leaveModel = require('../../models/leaveModel');

const getMechanicLeaves = async (req, res) => {

    const mechanicId = req.userId;

    try {
        const leaves = await leaveModel.find({ mechanicId });

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

module.exports = getMechanicLeaves;