const individualWorkModel = require('../../models/individualWorkModel');

const addIndividualWork = async (req, res) => {
    const { workName, price, suitable } = req.body;
    const userRole = req.userRole;

    try {
        // Checking current user is admin or not
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can add new works',
                success: false
            });
        }

        // Checking all fields filled or not
        if (!workName || !price || !suitable) {
            return res.status(422).json({
                message: 'Please fill all fields',
                success: false
            });
        }

        // Create new package
        const newIndividualWork = new individualWorkModel({
            workName,
            price,
            suitable
        });

        // Save package
        const savedWork = await newIndividualWork.save();
        res.status(200).json({
            message: 'New work created',
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

module.exports = addIndividualWork;