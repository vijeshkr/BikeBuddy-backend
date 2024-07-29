const logout = (req, res) => {
    try {
        res.clearCookie('accessToken',{
            secure: true,
            sameSite: 'none'
        }).status(200).json({
            message: 'User has been logged out',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: 'Inernal server error',
            success: false
        })
    }
}

module.exports = logout;