import express, { Request, Response } from 'express';
import Location from '../models/location.ts';
import { httpResponse } from '../lib/httpResponse.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

const router = express.Router();

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title, description, coordinates, visibility, photos, tags } = req.body;

        const location = new Location({
            title,
            description,
            coordinates,
            createdBy: req.user.id,
            visibility,
            photos,
            tags,
        });

        await location.save();
        return httpResponse(201, "Location created successfully", location, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, "Failed to create location", { error }, res);
    }
});

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const locations = await Location.find({
            $or: [
                { visibility: 'public' },
                { createdBy: req.user.id },
            ]
        });
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
        const { tags, visibility, minRating } = req.query;

        const filter: any = {};

        if (tags) {
            const tagsArray = (tags as string).split(',');
            filter.tags = { $in: tagsArray };
        }

        if (visibility) {
            filter.visibility = visibility;
        }

        if (minRating) {
            filter.rating = { $gte: parseFloat(minRating as string) };
        }

        const locations = await Location.find(filter);

        return httpResponse(200, "Filtered locations fetched successfully", locations, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, "Failed to fetch filtered locations", null, res);
    }
});

router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const location = await Location.findById(req.params.id);

        if (!location) {
            return httpResponse(404, "Location not found", null, res);
        }

        if (String(location.createdBy) !== req.user.id) {
            return httpResponse(403, "Unauthorized to update this location", null, res);
        }

        Object.assign(location, req.body);
        await location.save();

        return httpResponse(200, "Location updated successfully", location, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, "Failed to update location", { error }, res);
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
