const sparePartModel = require('../../models/sparePartModel');
const { io } = require('../../config/socket');

const updateSpare = async (req, res) => {
    const spareId = req.params.spareId;
    const userRole = req.userRole;
    const { price, stock } = req.body
    try {
        // Checking current user is admin or not
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can update spare',
                success: false
            });
        }

        // Find the spare by id
        const spare = await sparePartModel.findById(spareId);

        if (!spare) {
            return res.status(404).json({
                message: 'Item not found',
                success: false
            });
        }

        // Has changed function to check if there any changes
        const hasChanged = (
            spare.stock !== stock ||
            spare.price !== price
        );

        if (!hasChanged) {
            return res.status(200).json({
                message: 'No changes detected',
                success: false
            })
        }

        // Update the spare
        spare.stock = stock;
        spare.price = price;

        // Save the spare
        const savedSpare = await spare.save();

        // Send new spare to mechanic spare page using socket io
        io.emit('updatedSpare', savedSpare);

        res.status(200).json({
            message: 'Spare updated',
            success: true,
            data: savedSpare
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = updateSpare;