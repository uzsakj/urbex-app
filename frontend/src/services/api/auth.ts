import { httpClient } from './httpClient';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export const login = async (loginDto: LoginDto) => {
    return await httpClient('/api/login', 'POST', loginDto);
};

export const register = async (registerDto: RegisterDto) => {
    return await httpClient('/api/register', 'POST', registerDto);
};

export const logout = async () => {
    await httpClient('/api/logout', 'POST');
    localStorage.removeItem('authToken');
};

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('authToken');
    return !!token;
};

