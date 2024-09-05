const moment = require('moment');
const mechanicTargetsModel = require('../../models/mechanicTargetsModel');

const getAllMechanicTargets = async (req, res) => {
    const userRole = req.userRole;
    const { month, year } = req.query;

    try {
        // Checking current user is admin or not
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can do this task',
                success: false
            });
        }
        // Build the filter based on the presence of month and year
        let filter = {};

        if (month && year) {
            // If both month and year provided, match the exact 'YYYY-MM' format
            const targetMonth = `${year}-${month.padStart(2, 0)}`;
            filter = { 'achievement.month': targetMonth };
        } else if (month) {
            // If only month is provided, use the current year and match the 'YYYY-MM' format
            const currentYear = moment().year();
            const targetMonth = `${currentYear}-${month.padStart(2, '0')}`;
            filter = { 'achievement.month': targetMonth };
        } else if (year) {
            // If only the year is provided, use the provided year and the current month
            const currentMonth = (moment().month() + 1).toString().padStart(2, '0');
            const targetMonth = `${year}-${currentMonth}`;
            filter = { 'achievement.month': targetMonth };
        } else {
            // If no month or year is provided, use the current month and year
            const currentYear = moment().year();
            const currentMonth = (moment().month() + 1).toString().padStart(2, '0');
            const targetMonth = `${currentYear}-${currentMonth}`;
            filter = { 'achievement.month': targetMonth };
        }

        // Find mechanic targets based on the filter
        const mechanicTargets = await mechanicTargetsModel.find(filter).populate({
            path: 'mechanicId',
            select: '-password'
        });

        res.status(200).json({
            message: 'Mechanic targets data',
            success: true,
            data: mechanicTargets
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = getAllMechanicTargets;