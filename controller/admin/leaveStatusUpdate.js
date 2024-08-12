const leaveModel = require('../../models/leaveModel');
// const { sendLeaveStatusMail } = require('../../common/utils');

const leaveStatusUpdate = async (req, res) => {
    const leaveId = req.params.id;
    const { status } = req.body;
    const userRole = req.userRole;

    try {
        // Check if the user is an admin
        if(userRole !== 'admin'){
            return res.status(403).json({
                message: 'Only admin can update the leave status',
                success: false
            });
        }

        // Validate the status value
        const validateStatus = ['Approved', 'Rejected'];
        if(!validateStatus.includes(status)){
            return res.status(403).json({
                message: 'Invalid status value',
                success: false
            });
        }

        // Find and update the leave request
        const leave = await leaveModel.findById(leaveId).populate('mechanicId');
        if(!leave){
            return res.status(404).json({
                message: 'Leave request not found',
                success: false
            });
        }

        // Update the status field
        leave.status = status;
        const updatedLeave = await leave.save();

        // Send email
        // await sendLeaveStatusMail(
        //     leave.mechanicId.email,
        //     status,
        //     leave.startDate,
        //     leave.endDate
        // );

        return res.status(200).json({
            message: 'Leave status updated successfully',
            success: true,
            data: updatedLeave
        });

    } catch (error) {
        console.error('Error updating leave status:', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

module.exports = leaveStatusUpdate;