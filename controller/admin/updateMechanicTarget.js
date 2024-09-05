const moment = require("moment");
const mechanicTargetsModel = require('../../models/mechanicTargetsModel');

const updateMechanicTarget = async (req, res) => {
    const { mechanicId } = req.params;
    const { spareTarget, labourTarget, incentivePercentage, baseSalary } = req.body;

    try {
        // Ensure only admin users can update targets
        if (req.userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can perform this task',
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

        // Find the correct achievement for the current month
        const achievement = mechanicTarget.achievement.find(ach => ach.month === targetMonth);

        // Update the fields if they are provided
        if (spareTarget !== undefined) achievement.spareTarget = spareTarget;
        if (labourTarget !== undefined) achievement.labourTarget = labourTarget;
        if (incentivePercentage !== undefined) achievement.incentivePercentage = incentivePercentage;
        if (baseSalary !== undefined) mechanicTarget.baseSalary = baseSalary;

        // Save the updated mechanic target
        await mechanicTarget.save();

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

module.exports = updateMechanicTarget;