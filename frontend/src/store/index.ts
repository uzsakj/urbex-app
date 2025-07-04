import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import locationReducer from '../features/location/locationSlice';
import profileReducer from '../features/profile/profileSlice';
import friendsReducer from '../features/friendship/friendSlice';
import notificationReducer from '../features/notification/notificationSlice';
import searchReducer from '../features/search/searchSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        locations: locationReducer,
        profile: profileReducer,
        friends: friendsReducer,
        notifications: notificationReducer,
        search: searchReducer,
        ui: uiReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
