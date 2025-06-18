import { Response } from 'express';
import { NotificationService } from '../services/NotificationService.ts';
import { httpResponse } from '../utils/httpResponse.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

const notificationService = new NotificationService();

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const unreadOnly = req.query.unread === 'true';
        const notifications = await notificationService.getNotificationsForUser(req.user.id, unreadOnly);
        return httpResponse(200, 'Notifications retrieved', notifications, res);
    } catch (error) {
        return httpResponse(500, 'Failed to get notifications', { error }, res);
    }
};

export const markNotificationAsRead = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        await notificationService.markAsRead(id, req.user.id);
        return httpResponse(200, 'Notification marked as read', {}, res);
    } catch (error) {
        return httpResponse(400, 'Failed to mark as read', { error }, res);
    }
};

export const deleteNotification = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        await notificationService.deleteNotification(id, req.user.id);
        return httpResponse(200, 'Notification deleted', {}, res);
    } catch (error) {
        return httpResponse(400, 'Failed to delete notification', { error }, res);
    }
};
