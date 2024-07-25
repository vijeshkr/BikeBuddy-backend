const userModel = require("../../models/userModel");

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        // Find the user by verification token
        const user = await userModel.findOne({
            verificationToken: token,
        });
        // If user is found update isVerified field to true
        if(user){
            user.isVerified = true;
            user.verificationToken = null;
            await user.save();
            return res.status(200).json({
                message: 'You have successfully verified your account',
                success: true
            });
        }else{
            return res.status(404).json({
                message: 'Invalid verification token',
                success: false
            });
        }
    } catch (error) {
        console.log('Error verifying email: ', error);
        return res.status(500).json({message:'Inernal server error',
            success: false
        });
    }
}

module.exports = verifyEmail;