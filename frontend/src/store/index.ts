import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import locationReducer from '../features/location/locationSlice';
import profileReducer from '../features/profile/profileSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        locations: locationReducer,
        profile: profileReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
