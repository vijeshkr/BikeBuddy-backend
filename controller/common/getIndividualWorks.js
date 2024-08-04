const individualWorkModel = require('../../models/individualWorkModel');

const getIndividualWorks = async (req, res) => {
    try {
        const individualWorks = await individualWorkModel.find();
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