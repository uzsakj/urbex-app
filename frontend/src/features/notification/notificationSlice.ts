// features/notifications/notificationSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from './types';
import * as api from './notificationAPI';

interface NotificationState {
    notifications: Notification[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: NotificationState = {
    notifications: [],
    status: 'idle',
    error: null,
};

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, thunkAPI) => {
        try {
            return await api.fetchNotifications();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (id: string, thunkAPI) => {
        try {
            await api.markAsRead(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
        }
    }
);

export const deleteNotification = createAsyncThunk(
    'notifications/deleteNotification',
    async (id: string, thunkAPI) => {
        try {
            await api.deleteNotification(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
                state.status = 'succeeded';
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action: PayloadAction<string>) => {
                const notif = state.notifications.find(n => n.id === action.payload);
                if (notif) notif.isRead = true;
            })
            .addCase(deleteNotification.fulfilled, (state, action: PayloadAction<string>) => {
                state.notifications = state.notifications.filter(n => n.id !== action.payload);
            });
    },
});

export default notificationSlice.reducer;
