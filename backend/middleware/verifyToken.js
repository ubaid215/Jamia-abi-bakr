const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Extract the token from the cookies
    const token = req.cookies.token;

    // If no token is provided, return an unauthorized response
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Unauthorized - No token provided" 
        });
    }

    try {
        // Verify the token using the JWT secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error verifying token:', error);

        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized - Token expired" 
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized - Invalid token" 
            });
        }

        // Handle other errors
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

module.exports = verifyToken; // Use CommonJS export