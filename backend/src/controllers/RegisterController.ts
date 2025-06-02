import { Request, Response } from 'express';
import { httpResponse } from '../utils/httpResponse.ts';
import { UserService } from '../services/UserService.ts';

const userService = new UserService();

export const handleRegister = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return httpResponse(400, "Missing required fields", {}, res);
        }

        const existingUser = await userService.getUserByUsername(username);
        if (existingUser) {
            return httpResponse(400, "Username already taken", {}, res);
        }

        await userService.registerUser({ username, email, password });

        return httpResponse(200, "User registered successfully", {}, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, "Internal server error", { error }, res);
    }
};
