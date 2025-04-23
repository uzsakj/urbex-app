import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { httpResponse } from '../lib/httpResponse.ts';

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

        if (typeof decoded !== 'string' && decoded && 'userId' in decoded) {
            req.user = { id: decoded.userId };
            next();
        } else {
            return httpResponse(403, 'Forbidden: Invalid token', null, res);
        }
    } catch (err) {
        return httpResponse(403, 'Forbidden: Invalid or expired token', null, res);
    }
};
