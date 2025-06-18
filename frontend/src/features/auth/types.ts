import { Status } from "../../store/status.enum";

export interface User {
    id: string;
    username: string;
    email: string;
    profileIncomplete: boolean
}

export interface AuthState {
    user: User | null;
    status: Status;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    token: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
}