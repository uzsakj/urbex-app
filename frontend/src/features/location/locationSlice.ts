import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocationResponse, LocationState } from './types';
import * as api from './locationAPI';
import { Status } from '../../store/status.enum';



const initialState: LocationState = {
    items: [],
    total: 0,
    status: Status.IDLE,
    error: null,
};

export const fetchLocations = createAsyncThunk<LocationResponse, void, { rejectValue: string }>(
    'locations/fetchAll',
    async (_, thunkAPI) => {
        try {
            return await api.fetchLocations();
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    });

export const fetchLocationsPaginated = createAsyncThunk<LocationResponse, { page?: number; limit?: number }, { rejectValue: string }>(
    'locations/fetch',
    async (params, thunkAPI) => {
        try {
            return await api.fetchLocationsPaginated(params);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    });

export const createLocation = createAsyncThunk<void, FormData, { rejectValue: string }>(
    'locations/',
    async (locationData, thunkAPI) => {
        try {
            return await api.createLocation(locationData);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    });

const locationSlice = createSlice({
    name: 'locations',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchLocations.pending, state => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(fetchLocations.fulfilled, (state, action: PayloadAction<LocationResponse>) => {
                state.status = Status.SUCCEEDED;
                state.items = action.payload.data;
                state.total = action.payload.total || 0;
            })
            .addCase(fetchLocations.rejected, (state, action) => {
                state.status = Status.FAILED;
                state.error = action.payload || 'Something went wrong';
            })
            .addCase(fetchLocationsPaginated.pending, state => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(fetchLocationsPaginated.fulfilled, (state, action: PayloadAction<LocationResponse>) => {
                state.status = Status.SUCCEEDED;
                state.items = action.payload.data;
                state.total = action.payload.total || 0;
            })
            .addCase(fetchLocationsPaginated.rejected, (state, action) => {
                state.status = Status.FAILED;
                state.error = action.payload || 'Something went wrong';
            });
    },
});

export default locationSlice.reducer;
