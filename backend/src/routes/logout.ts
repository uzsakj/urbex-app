import express, { Request, Response } from 'express';
import { httpResponse } from '../lib/httpResponse.ts';

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';
router.post('/', async (req: Request, res: Response) => {
    try {

        return httpResponse(200, 'Logout successful', {}, res)

    } catch (error) {
        return httpResponse(500, "Internal server error", { error: error }, res);
    }
})

export default router;