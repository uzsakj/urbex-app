import { Request, Response } from 'express';
import { httpResponse } from '../utils/httpResponse.ts';
import { ProfileService } from '../services/ProfileService.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

const profileService = new ProfileService();

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const profile = await profileService.getProfileByUserId(req.user.id);
        if (!profile) return httpResponse(404, 'Profile not found', null, res);
        return httpResponse(200, 'Profile fetched successfully', profile, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, 'Failed to fetch profile', { error }, res);
    }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const data = { ...req.body, user: { id: req.user.id } };
        const profile = await profileService.createOrUpdateProfile(data);
        return httpResponse(200, 'Profile updated successfully', profile, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, 'Failed to update profile', { error }, res);
    }
};

export const deleteProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        await profileService.deleteProfileByUserId(req.user.id);
        return httpResponse(200, 'Profile deleted successfully', null, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, 'Failed to delete profile', { error }, res);
    }
};
