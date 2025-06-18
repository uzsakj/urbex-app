
import api from '../../lib/axios';
import { LocationResponse } from './types';

export const fetchLocations = async (): Promise<LocationResponse> => {
    const response = await api.get('/api/location');
    return response.data.data;
};

export const fetchLocationsPaginated = async ({ page = 1, limit = 10 }): Promise<LocationResponse> => {
    const response = await api.get('/api/location',
        {
            params: { page, limit }
        });
    return response.data.data;
};

export const createLocation = async (location: FormData): Promise<void> => {
    await api.post('/api/location', location);
};
