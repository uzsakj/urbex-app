import { Location } from './types';
import api from '../../lib/axios';

export const fetchLocations = async (): Promise<Location[]> => {
    const response = await api.get('/api/location');
    return response.data.data;
};

export const createLocation = async (location: FormData): Promise<void> => {
    await api.post('/api/location', location);
};
