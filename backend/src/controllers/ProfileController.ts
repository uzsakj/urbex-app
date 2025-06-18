import { Request, Response } from 'express';
import { httpResponse } from '../utils/httpResponse.ts';
import { ProfileService } from '../services/ProfileService.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

const profileService = new ProfileService();

export const handleGetProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.params.userId === 'me' ? req.user.id : req.params.userId;
        const profile = await profileService.getProfileByUserId(userId);
        if (!profile) return httpResponse(404, 'Profile not found', null, res);
        return httpResponse(200, 'Profile fetched successfully', profile, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, 'Failed to fetch profile', { error }, res);
    }
};

export const handleUpdateProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const data = { ...req.body, user: { id: req.user.id } };
        const file = req.file;
        const profile = await profileService.createOrUpdateProfile(data, file);
        return httpResponse(200, 'Profile updated successfully', profile, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, 'Failed to update profile', { error }, res);
    }
};

export const handleDeleteProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        await profileService.deleteProfileByUserId(req.user.id);
        return httpResponse(200, 'Profile deleted successfully', null, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, 'Failed to delete profile', { error }, res);
    }
};
