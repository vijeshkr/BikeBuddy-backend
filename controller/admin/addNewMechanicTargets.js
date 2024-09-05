const mechanicTargetsModel = require('../../models/mechanicTargetsModel');

const addNewMechanicTarget = async (req, res) => {
    const userRole = req.userRole;
     // Extract data from the request body
     const { mechanicId, baseSalary, labourTarget, spareTarget, incentivePercentage } = req.body;
    try {
        // Checking all fields filled or not
    if (!mechanicId || !baseSalary || !labourTarget || !spareTarget || !incentivePercentage) {
        return res.status(422).json({
            message: 'Please fill all fields',
            success: false
        });
    }

    // Validation: Check if values are valid numbers
    if (baseSalary <= 0 || labourTarget < 0 || spareTarget < 0 || incentivePercentage < 0) {
        return res.status(422).json({
            message: 'Invalid values',
            success: false
        });
    }
        // Checking current user is admin or not
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can do this task',
                success: false
            });
        }

        // Get the current month in "YYYY-MM" format
        const currentDate = new Date();
        const currentMonth = currentDate.toISOString().slice(0, 7);

        // Check if the mechanic already has an entry for the current month
        const existingMechanicTarget = await mechanicTargetsModel.findOne({ mechanicId });

        if(existingMechanicTarget){
            return res.status(400).json({
                message: 'Targets already exists',
                success: false
            });
        }

        // Create a new mechanic target with achievement
        const newMechanicTarget = new mechanicTargetsModel({
            mechanicId,
            baseSalary,
            achievement: [{
                month: currentMonth,
                labourTarget,
                spareTarget,
                incentivePercentage
            }]
        });

        // Save the new mechanic target
        const savedMechanicTarget = await newMechanicTarget.save();

        return res.status(200).json({
            message: 'Targets added successfully',
            success: true,
            data: savedMechanicTarget
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = addNewMechanicTarget;