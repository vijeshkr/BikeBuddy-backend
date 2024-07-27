const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    // Retrieve token from cookies
    const token = req.cookies.accessToken;

    // If no token found return the error message
    if (!token) {
        return res.status(401).json({
            message: 'Please login',
            success: false
        });
    }

    // Verify the token using secret key
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user details to the request object
        req.userId = decoded._id;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        return res.status(400).json({
            message: 'Invalid token',
            success: false
        });
    }
}

module.exports = authMiddleware;