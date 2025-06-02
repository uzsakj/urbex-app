import { Request, Response } from 'express';
import fs from 'fs';
import cloudinary from '../utils/cloudinary.ts';
import { httpResponse } from '../utils/httpResponse.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { UserService } from '../services/UserService.ts';
import { LocationService } from '../services/LocationService.ts';

const userService = new UserService();
const locationService = new LocationService(userService);

export const handleCreateLocation = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { name, description, coordinates, visibility, tags } = req.body;
        const uploadedPhotos: string[] = [];
        const user = await userService.getUserById(req.user.id);

        if (req.files) {
            for (const file of req.files as Express.Multer.File[]) {
                const uploadResult = await cloudinary.uploader.upload(file.path, { folder: 'locations' });
                uploadedPhotos.push(uploadResult.secure_url);
                fs.unlinkSync(file.path);
            }
        }

        const location = await locationService.createLocation({
            name,
            description,
            coordinates: JSON.parse(coordinates),
            createdBy: req.user.id,
            visibility,
            photos: uploadedPhotos,
            tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
        });

        return httpResponse(201, "Location created successfully", location, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, "Failed to create location", { error }, res);
    }
};

export const handleUpdateLocation = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const location = await locationService.getLocationById(req.params.id);

        if (!location) return httpResponse(404, "Location not found", null, res);
        if (String(location.createdBy) !== req.user.id)
            return httpResponse(403, "Unauthorized to update this location", null, res);

        const { name, description, coordinates, visibility, tags } = req.body;
        const newPhotos: string[] = [];

        if (req.files) {
            for (const file of req.files as Express.Multer.File[]) {
                const uploadResult = await cloudinary.uploader.upload(file.path, { folder: 'locations' });
                newPhotos.push(uploadResult.secure_url);
                fs.unlinkSync(file.path);
            }
        }

        await locationService.updateLocation({
            id: location.id,
            name,
            description,
            coordinates,
            visibility,
            tags,
            photos: [...location.photos, ...newPhotos],
        });

        return httpResponse(200, "Location updated successfully", location, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, "Failed to update location", { error }, res);
    }
};

export const handleGetLocations = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const userId = req.user.id;

        const result = await locationService.getFilteredLocations(page, limit, userId);

        return httpResponse(200, "Locations fetched successfully", result, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, "Failed to fetch locations", { error }, res);
    }
};

export const handleGetLocationById = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const location = await locationService.getLocationById(req.params.id);
        if (!location) return httpResponse(404, "Location not found", null, res);
        return httpResponse(200, "Location fetched successfully", location, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, "Failed to fetch location", { error }, res);
    }
};

export const handleDeleteLocation = async (req: AuthenticatedRequest, res: Response) => {
    try {
        await locationService.deleteById(req.params.id, req.user.id);
        return httpResponse(200, "Location deleted successfully", null, res);
    } catch (error) {
        console.error(error);
        return httpResponse(500, "Failed to delete location", { error }, res);
    }
};
