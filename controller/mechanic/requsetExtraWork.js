const allocationModel = require('../../models/allocationModel');

const requestExtraWork = async (req, res) => {
    const { id } = req.params;
    const{ description, amount } = req.body;

    try {

        // Check if the description and amount available or not
        if(!description && !amount){
            return res.status(422).json({
                message: 'Please fill the fields',
                success: false
            });
        }

        // Find the allocation by id and update the relevant fields
        const allocation = await allocationModel.findByIdAndUpdate(
            id,
            {
                extraWorkDescription: description,
                extraWorkEstimationAmount: amount,
                customerApproval: 'Pending'
            },
            { new: true } // This option returns the updated document
        );

        if (!allocation) {
            return res.status(404).json({ 
                message: 'Allocation not found',
                success: false
            });
        }

        res.json({ 
            message: 'Extra work requested successfully',
            success: true, 
            data: allocation });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }

}

module.exports = requestExtraWork;