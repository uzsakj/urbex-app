import api from '../../lib/axios';
import { Notification } from './types';

export const fetchNotifications = async (): Promise<Notification[]> => {
    const response = await api.get('/api/notification');
    return response.data.data;
};

export const markAsRead = async (id: string): Promise<void> => {
    await api.patch(`/api/notification/${id}/read`);
};

export const deleteNotification = async (id: string): Promise<void> => {
    await api.delete(`/api/notification/${id}`);
};