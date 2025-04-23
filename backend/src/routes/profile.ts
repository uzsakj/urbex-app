import express from 'express';
import Profile from '../models/profile.ts';
import { httpResponse } from '../lib/httpResponse.ts';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

const router = express.Router();

router.get('/', async (req: AuthenticatedRequest, res) => {
    const userId = req?.user?.id;

    try {
        const profile = await Profile.findOne({ user: userId });

        if (!profile) {
            return httpResponse(404, 'Profile not found', null, res);
        }

        return httpResponse(200, 'Profile fetched successfully', profile, res);
    } catch (err) {
        console.error(err);
        return httpResponse(500, 'Failed to fetch profile', null, res);
    }
});

router.post('/', async (req: AuthenticatedRequest, res) => {
    const { fullName, bio, location } = req.body;
    const userId = req?.user?.id;

    try {
        let profile = await Profile.findOne({ user: userId });

        if (profile) {
            profile.user = userId;
            profile.fullName = fullName ?? profile.fullName;
            profile.bio = bio ?? profile.bio;
            profile.location = location ?? profile.location;

            await profile.save();
            return httpResponse(200, 'Profile updated successfully', profile, res);
        }

        profile = new Profile({
            user: userId,
            fullName,
            bio,
            location,
        });

        await profile.save();
        return httpResponse(201, 'Profile created successfully', profile, res);
    } catch (err) {
        console.error(err);
        return httpResponse(500, 'Failed to save profile', null, res);
    }
});

export default router;