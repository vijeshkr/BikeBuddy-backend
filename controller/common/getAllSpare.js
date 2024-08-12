const sparePartModel = require('../../models/sparePartModel');

const getAllSpare = async (req, res) => {
    try {
        // Fetch all spare parts from the database and populate the 'suitable' field
        const allSpareParts = await sparePartModel.find().populate('suitable');

        // Send a successful response with the fetched spare parts data
        return res.status(200).json({
            message: 'All spare parts',
            success: true,
            data: allSpareParts
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = getAllSpare;