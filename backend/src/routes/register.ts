import express, { Request, Response } from 'express';
import { httpResponse } from '../lib/httpResponse.ts';
import User from '../models/user.ts';

const router = express.Router();

router.post('/', async (req: Request & {
    body: {
        username: string;
        email: string;
        password: string
    }
}, res: Response) => {
    try {

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return httpResponse(400, "Missing required fields", {}, res);
        }


        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Create User
        const user = new User({ username, email });
        // Set password 
        user.setPassword(password)

        const timeStamp = new Date();
        user.createdAt = timeStamp
        await user.save();

        return httpResponse(200, 'User registered successfully', {}, res)

    } catch (error) {
        return httpResponse(500, "Internal server error", { error: error }, res);
    }
})

export default router;