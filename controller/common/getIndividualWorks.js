const individualWorkModel = require('../../models/individualWorkModel');

const getIndividualWorks = async (req, res) => {
    try {
        // Fetch all individual work details from the database
        const individualWorks = await individualWorkModel.find();

        // Send a successfull response with retrieved data
        return res.status(200).json({
            message: 'All individual works',
            success: true,
            data: individualWorks
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }

}

module.exports = getIndividualWorks;