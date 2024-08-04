const individualWorkModel = require('../../models/individualWorkModel');

const updateIndividualWork = async (req, res) => {

    const { _id, workName, price, suitable } = req.body;
    const userRole = req.userRole;

    try {
        // Checking current user is admin or not
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can update packages',
                success: false
            });
        }

        // Find the work by id
        const work = await individualWorkModel.findById(_id);

        if (!work) {
            return res.status(404).json({
                message: 'Work not found',
                success: false
            });
        }

        // Has changed function to check if there any changes
        const hasChanged = (
            work.workName !== workName ||
            work.price !== price ||
            work.suitable !== suitable
        );

        if (!hasChanged) {
            return res.status(200).json({
                message: 'No changes detected',
                success: false
            })
        }

        // Update the work
        work.workName = workName;
        work.price = price;
        work.suitable = suitable;

        // Save work
        const savedWork = await work.save();
        res.status(200).json({
            message: 'Work updated',
            success: true,
            data: savedWork
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = updateIndividualWork;