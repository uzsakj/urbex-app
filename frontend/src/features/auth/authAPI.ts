import api from '../../lib/axios';
import { LoginCredentials, LoginResponse, RegisterCredentials, User } from './types';


export const callLogin = async ({ email, password }: LoginCredentials): Promise<User> => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });

    const { user, token } = response.data;

    localStorage.setItem('token', token);

    return user;
};


export const callRegister = async (credentials: RegisterCredentials): Promise<void> => {
    return await api.post('/auth/register', credentials);
};




