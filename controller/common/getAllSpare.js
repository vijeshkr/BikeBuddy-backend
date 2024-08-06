const sparePartModel = require('../../models/sparePartModel');

const getAllSpare = async (req, res) => {
    try {
        const allSpareParts = await sparePartModel.find().populate('suitable');
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