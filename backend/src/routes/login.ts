import express, { Request, Response } from 'express';
import { httpResponse } from '../lib/httpResponse.ts';
import User from '../models/user.ts';
import Profile from '../models/profile.ts';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';
router.post('/', async (req: Request & {
    body: {
        email: string;
        password: string
    }
}, res: Response) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return httpResponse(400, "Missing required fields", {}, res);
        }


        // Check if user exists and pw is valid
        const user = await User.findOne({ email });
        const profile = await Profile.findOne({ user });
        if (!user || !user.validatePassword(password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, profileIncomplete: !!profile ? false : true });

    } catch (error) {
        return httpResponse(500, "Internal server error", { error: error }, res);
    }
})

export default router;