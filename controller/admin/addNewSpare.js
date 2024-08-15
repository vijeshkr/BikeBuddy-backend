const sparePartModel = require('../../models/sparePartModel');
const { io } = require('../../config/socket');

const addNewSpare = async (req, res) => {
    const userRole = req.userRole;
    const { itemName, image, price, stock, suitable } = req.body;
    try {
        // Checking current user is admin or not
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can add new spare',
                success: false
            });
        }

        // Checking all fields filled or not
        if (!itemName || !image || !price || !stock || !suitable) {
            return res.status(422).json({
                message: 'Please fill all fields',
                success: false
            });
        }

        // Create new spare
        const newSpare = new sparePartModel({
            itemName,
            image,
            price,
            stock,
            suitable
        });

        // Save spare
        const savedSpare = await newSpare.save();

        // Send new spare to mechanic spare page using socket io
        io.emit('newSpare', savedSpare);

        res.status(200).json({
            message: 'New spare created',
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

module.exports = addNewSpare;