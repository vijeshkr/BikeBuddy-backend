const individualWorkModel = require('../../models/individualWorkModel');

const deleteIndividualWork = async (req, res) => {
    const { workId } = req.body;
    const userRole = req.userRole;
    
    try {
        // Checking current user is admin or not
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can delete works',
                success: false
            });
        }

        // Find and delete the work by id
        const deletedWork = await individualWorkModel.findByIdAndDelete(workId);

        if (!deletedWork) {
            return res.status(404).json({
                message: 'Work not found',
                success: false
            });
        }

        return res.status(200).json({
            message: 'Work successfully deleted',
            success: true,
            data: deletedWork
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = deleteIndividualWork;