import express from 'express';
import multer from 'multer';
import { handleCreateLocation, handleUpdateLocation, handleGetLocations, handleGetLocationById, handleDeleteLocation } from '../controllers/LocationController.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

const router = express.Router();

const storage = multer.diskStorage({
    destination: 'uploads/locationPictures/',
    filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.post('/', upload.array('photos', 10), handleCreateLocation);
router.patch('/:id', upload.array('photos', 10), handleUpdateLocation);
router.get('/', handleGetLocations);
router.get('/:id', handleGetLocationById);
router.delete('/:id', handleDeleteLocation);

export default router;
