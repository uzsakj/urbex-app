import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { httpResponse } from '../lib/httpResponse';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthenticatedRequest extends Request {
    user?: any;
}

export const authenticateJWT = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return httpResponse(401, 'Unauthorized: No token provided', null, res);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return httpResponse(403, 'Forbidden: Invalid or expired token', null, res);
    }
};
