import express, { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import cloudinary from '../lib/cloudinary.ts';
import Location from '../models/location.ts';
import { httpResponse } from '../lib/httpResponse.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

const router = express.Router();

const storage = multer.diskStorage({
    destination: 'uploads/locationPictures/',
    filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.post('/', upload.array('photos', 10), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { name, description, coordinates, visibility, tags } = req.body;

        const uploadedPhotos: string[] = [];

        if (req.files) {
            for (const file of req.files as Express.Multer.File[]) {
                const uploadResult = await cloudinary.uploader.upload(file.path, {
                    folder: 'locations',
                });
                uploadedPhotos.push(uploadResult.secure_url);
                fs.unlinkSync(file.path);
            }
        }
        const rawCoords = JSON.parse(coordinates);
        const geoJSON = {
            type: 'Point',
            coordinates: [rawCoords.lng, rawCoords.lat],
        };
        const location = new Location({
            name,
            description,
            coordinates: geoJSON,
            createdBy: req.user.id,
            visibility,
            photos: uploadedPhotos,
            tags: tags ? tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
        });

        await location.save();
        return httpResponse(201, "Location created successfully", location, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, "Failed to create location", { error }, res);
    }
});

router.put('/:id', upload.array('photos', 10), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const location = await Location.findById(req.params.id);

        if (!location) {
            return httpResponse(404, "Location not found", null, res);
        }

        if (String(location.createdBy) !== req.user.id) {
            return httpResponse(403, "Unauthorized to update this location", null, res);
        }

        const { name, description, coordinates, visibility, tags } = req.body;

        const newPhotos: string[] = [];

        if (req.files) {
            for (const file of req.files as Express.Multer.File[]) {
                const uploadResult = await cloudinary.uploader.upload(file.path, {
                    folder: 'locations',
                });
                newPhotos.push(uploadResult.secure_url);
                fs.unlinkSync(file.path);
            }
        }

        location.name = name ?? location.name;
        location.description = description ?? location.description;
        location.coordinates = coordinates ? JSON.parse(coordinates) : location.coordinates;
        location.visibility = visibility ?? location.visibility;
        location.tags = tags ? tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
            location.photos = [...location.photos, ...newPhotos];

        await location.save();

        return httpResponse(200, "Location updated successfully", location, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, "Failed to update location", { error }, res);
    }
});

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const userId = req.user.id;
        const friends = req.user.friends || [];

        const filter = {
            $or: [
                { visibility: 'public' },
                { createdBy: userId },
                { $and: [{ visibility: 'friends' }, { createdBy: { $in: friends } }] },
            ],
        };

        const locations = await Location.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit as string));

        return httpResponse(200, "Locations fetched successfully", locations, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, "Failed to fetch locations", { error }, res);
    }
});

router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const location = await Location.findById(req.params.id);

        if (!location) {
            return httpResponse(404, "Location not found", null, res);
        }

        return httpResponse(200, "Location fetched successfully", location, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, "Failed to fetch location", { error }, res);
    }
});

router.get('/filter', async (req: AuthenticatedRequest, res) => {
    try {
        const { tags, visibility, minRating, page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const filter: any = {};

        if (tags) {
            const tagsArray = (tags as string).split(',');
            filter.tags = { $in: tagsArray };
        }

        if (visibility) {
            filter.visibility = visibility;
        }

        if (minRating) {
            filter.ratings = {
                $elemMatch: {
                    rating: { $gte: parseFloat(minRating as string) },
                },
            };
        }

        const locations = await Location.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit as string));

        return httpResponse(200, "Filtered locations fetched successfully", locations, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, "Failed to fetch filtered locations", null, res);
    }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const location = await Location.findById(req.params.id);

        if (!location) {
            return httpResponse(404, "Location not found", null, res);
        }

        if (String(location.createdBy) !== req.user.id) {
            return httpResponse(403, "Unauthorized to delete this location", null, res);
        }

        await location.deleteOne();
        return httpResponse(200, "Location deleted successfully", null, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, "Failed to delete location", { error }, res);
    }
});

export default router;
