import api from '../../lib/axios';
import { LoginCredentials, LoginResponse, RegisterCredentials, User } from './types';


export const login = async ({ email, password }: LoginCredentials): Promise<{ user: User, token: string }> => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });

    const { user, token } = response.data;

    return { user, token };
};


export const register = async (credentials: RegisterCredentials): Promise<void> => {
    return await api.post('/auth/register', credentials);
};




