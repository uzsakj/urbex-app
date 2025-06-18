import { Profile } from './types';
import api from '../../lib/axios';

export const getProfile = async (userId: string): Promise<Profile> => {
    const response = await api.get(`/api/profile/${userId}`);
    return response.data.data;
};

export const updateProfile = async (formData: FormData): Promise<void> => {
    await api.patch('/api/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

