const allocationModel = require('../../models/allocationModel');
const bookingModel = require('../../models/bookingModel');

const allocateWork = async (req, res) => {
    const userRole = req.userRole;
    const { bookingId, mechanicId } = req.body;

    try {

        // Checking current user is admin or not
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can allocate work',
                success: false
            });
        }

        // Allocate work to mechanic
        const allocation = new allocationModel({
            bookingId,
            mechanicId
        });

        // Save allocation
        const savedAllocation = await allocation.save();

        // Update booking status to 'Allocated' and set the allocation reference
        await bookingModel.findByIdAndUpdate(bookingId, {
            status: 'Allocated',
            // Update the allocation field with the new allocation ID
            allocation: savedAllocation._id
        });

        // Respond with success message
        res.status(200).json({
            message: 'Work allocated successfully',
            success: true,
            data: savedAllocation
        });

    } catch (error) {
        console.error('Error allocate work: ', error);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = allocateWork;