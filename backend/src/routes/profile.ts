import express from 'express';
import multer from 'multer';
import fs from 'fs';
import cloudinary from '../lib/cloudinary.ts';
import Profile from '../models/profile.ts';
import { httpResponse } from '../lib/httpResponse.ts';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

const upload = multer({ dest: 'avatars/' });
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

router.post('/', upload.single('avatar'), async (req: AuthenticatedRequest, res) => {
    const { fullName, biography, province } = req.body;
    const userId = req?.user?.id;

    try {
        let avatarUrl = null;

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'avatars',
            });
            avatarUrl = uploadResult.secure_url;
            fs.unlinkSync(req.file.path);
        }

        const profile = new Profile({
            user: userId,
            fullName,
            biography,
            province,
            avatarUrl,
        });

        await profile.save();

        return httpResponse(201, 'Profile created successfully', profile, res);
    } catch (err) {
        console.error(err);
        return httpResponse(500, 'Failed to create profile', null, res);
    }
});

router.patch('/', upload.single('avatar'), async (req: AuthenticatedRequest, res) => {
    const userId = req?.user?.id;

    try {
        let avatarUrl;
        console.log(req.file)
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'avatars',
            });
            avatarUrl = uploadResult.secure_url;
            fs.unlinkSync(req.file.path);
        }

        const updates: any = {
            ...(req.body.fullName && { fullName: req.body.fullName }),
            ...(req.body.biography && { biography: req.body.biography }),
            ...(req.body.province && { province: req.body.province }),
            ...(avatarUrl && { avatarUrl }),
        };

        const profile = await Profile.findOneAndUpdate(
            { user: userId },
            { $set: updates },
            { new: true }
        );

        if (!profile) {
            return httpResponse(404, 'Profile not found', null, res);
        }

        return httpResponse(200, 'Profile updated successfully', profile, res);
    } catch (err) {
        console.error(err);
        return httpResponse(500, 'Failed to update profile', null, res);
    }
});

// DELETE avatar
router.delete('/avatar', async (req: AuthenticatedRequest, res) => {
    const userId = req?.user?.id;

    try {
        const profile = await Profile.findOne({ user: userId });

        if (!profile) {
            return httpResponse(404, 'Profile not found', null, res);
        }

        profile.avatarUrl = undefined;
        await profile.save();

        return httpResponse(200, 'Avatar removed successfully', profile, res);
    } catch (err) {
        console.error(err);
        return httpResponse(500, 'Failed to delete avatar', null, res);
    }
});

export default router;
