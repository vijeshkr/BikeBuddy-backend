const leaveModel = require('../../models/leaveModel');

const getMechanicLeaves = async (req, res) => {

    const mechanicId = req.userId;

    try {
        // Fetch leave records from the database for the given mechanic id
        const leaves = await leaveModel.find({ mechanicId });

        // If no leave records respond with 404
        if (leaves.length === 0) {
            return res.status(404).json({
                message: 'No leave history available',
                success: false
            });
        } else {
            // If records are found, respond with 200 staus code and the data
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