const passwordResetModel = require("../../models/passwordResetModel");

const validateResetToken = async (req, res) => {

    const { token } = req.params;

    try {
        // Find the toke in the DB
        const resetToken = await passwordResetModel.findOne({ token});

        if(!resetToken){
            return res.status(404).json({
                message: 'Invalid token',
                success: false
            });
        }else{
            // If token found check if it's expired
            if(resetToken.expiry < Date.now()) {
                return res.status(400).json({
                    message: 'Token has expired',
                    success: false
                });
            }else{
                return res.status(200).json({
                    message: 'Token is valid',
                    success: true,
                    token: resetToken
                });
            }
        }
    } catch (error) {
        console.error('Error validating reset token: ',error);
        return res.status(500).json({
            message: 'Internal server error ',
            success: false
        });
    }
}

module.exports = validateResetToken;