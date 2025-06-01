import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Location, LocationState } from './types';
import { fetchLocations as fetchLocationsAPI, createLocation as createLocationAPI } from './locationAPI';
import { Status } from '../../store/status.enum';



const initialState: LocationState = {
    items: [],
    status: Status.IDLE,
    error: null,
};

export const fetchLocations = createAsyncThunk<Location[], void, { rejectValue: string }>(
    'locations/fetchAll',
    async (_, thunkAPI) => {
        try {
            return await fetchLocationsAPI();
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    });

export const createLocation = createAsyncThunk<void, FormData, { rejectValue: string }>(
    'locations/',
    async (locationData, thunkAPI) => {
        try {
            return await createLocationAPI(locationData);
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
            .addCase(fetchLocations.fulfilled, (state, action: PayloadAction<Location[]>) => {
                state.status = Status.SUCCEEDED;
                state.items = action.payload;
            })
            .addCase(fetchLocations.rejected, (state, action) => {
                state.status = Status.FAILED;
                state.error = action.payload || 'Something went wrong';
            });
    },
});

export default locationSlice.reducer;
