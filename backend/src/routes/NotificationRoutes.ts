import { Router } from 'express';
import { getNotifications, markNotificationAsRead, deleteNotification } from '../controllers/NotificationController.ts';
import { authenticateJWT } from '../middleware/auth.ts';

const router = Router();

router.use(authenticateJWT);

router.get('/', getNotifications);
router.patch('/:id/read', markNotificationAsRead);
router.delete('/:id', deleteNotification);

export default router;
