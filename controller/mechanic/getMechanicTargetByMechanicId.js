const moment = require("moment");
const mechanicTargetsModel = require('../../models/mechanicTargetsModel');

const getMechanicTargetByMechanicId = async (req, res) => {
    const { mechanicId } = req.params;

    try {
        // Check the user is mechanic or not
        if (req.userRole !== 'mechanic') {
            return res.status(403).json({
                message: 'Only mechanic can perform this task',
                success: false
            });
        }

        // Get the current month and year in 'YYYY-MM' format
        const targetMonth = moment().format('YYYY-MM');

        // Find the mechanic's target for the current month
        const mechanicTarget = await mechanicTargetsModel.findOne({
            mechanicId: mechanicId,
            'achievement.month': targetMonth
        });

        // If no target found, return an error
        if (!mechanicTarget) {
            return res.status(404).json({
                message: 'Mechanic target not found',
                success: false
            });
        }

        res.status(200).json({
            message: 'Mechanic target updated successfully',
            success: true,
            data: mechanicTarget
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = getMechanicTargetByMechanicId;