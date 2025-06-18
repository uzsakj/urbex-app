import { Request, Response } from 'express';
import { httpResponse } from '../utils/httpResponse.ts';
import { UserService } from '../services/UserService.ts';

const userService = new UserService();
export const handleSearchUsers = async (req: Request, res: Response) => {
    const query = req.query.q as string;

    if (!query || query.trim() === '') {
        return httpResponse(400, 'Search query is required', {}, res);
    }

    try {
        const results = await userService.searchUsers(query.trim());
        return httpResponse(200, 'Users fetched successfully', results, res);
    } catch (error) {
        console.error('Search error:', error);
        return httpResponse(500, 'Failed to search users', { error }, res);
    }
};
