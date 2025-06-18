import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, RegisterCredentials, User } from './types';
import * as api from './authAPI';
import { Status } from '../../store/status.enum';

const savedUser = localStorage.getItem('user');
const initialState: AuthState = {
    user: savedUser ? JSON.parse(savedUser) : null,
    status: Status.IDLE,
    error: null,
};

export const login = createAsyncThunk<
    User,
    LoginCredentials,
    { rejectValue: string }
>(
    'auth/login',
    async (credentials, thunkAPI) => {
        try {
            const { user, token } = await api.login(credentials);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            return user;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const register = createAsyncThunk<
    void,
    RegisterCredentials,
    { rejectValue: string }
>(
    'auth/register',
    async (credentials, thunkAPI) => {
        try {
            await api.register(credentials);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
                state.status = Status.SUCCEEDED;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = Status.FAILED;
                state.error = action.payload || 'Login failed';
            })
            .addCase(register.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.status = Status.SUCCEEDED;
            })
            .addCase(register.rejected, (state, action) => {
                state.status = Status.FAILED;
                state.error = action.payload || 'Registration failed';
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
