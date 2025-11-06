import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const tokenValue = token.split(' ')[1];

        if (!tokenValue) {
            return res.status(401).json({ msg: 'Token format is invalid' });
        }

        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

        // Attach user info from token to request object
        req.user = decoded.user;

        next(); // Continue to the next middleware or route
    } catch (error) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default authMiddleware;
