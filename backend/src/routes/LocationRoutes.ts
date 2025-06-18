import express from 'express';
import multer from 'multer';
import { handleCreateLocation, handleUpdateLocation, handleGetLocations, handleGetLocationById, handleDeleteLocation, handleSearchLocations } from '../controllers/LocationController.ts';
import { authenticateJWT } from '../middleware/auth.ts';

const router = express.Router();
router.use(authenticateJWT);
const storage = multer.diskStorage({
    destination: 'uploads/locationPictures/',
    filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.get('/', handleGetLocations);
router.get('/search', handleSearchLocations);
router.get('/:id', handleGetLocationById);
router.post('/', upload.array('photos', 10), handleCreateLocation);
router.patch('/:id', upload.array('photos', 10), handleUpdateLocation);
router.delete('/:id', handleDeleteLocation);

export default router;
