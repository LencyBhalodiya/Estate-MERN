import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return next(errorHandler(res, 403, 'Token not found'))
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) next(errorHandler(res, 403, 'token invalid'))
        req.user = user;
        next();
    })
}