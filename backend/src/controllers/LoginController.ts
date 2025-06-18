import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { httpResponse } from '../utils/httpResponse.ts';
import { UserService } from '../services/UserService.ts';
import { ProfileService } from '../services/ProfileService.ts';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';
const userService = new UserService();
const profileService = new ProfileService();
export const handleLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return httpResponse(400, "Missing required fields", {}, res);
        }

        const user = await userService.getUserByEmail(email);
        if (!user || !user.validatePassword(password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const profile = await profileService.getProfileByUserId(user.id);

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });

        return res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profileIncomplete: !profile
            },
            token
        });

    } catch (error) {
        console.error(error);
        return httpResponse(500, "Internal server error", { error }, res);
    }
};
