import React, { useEffect } from 'react';
import Header from '../components/Header';
import LocationGrid from '../components/LocationGrid';
import { fetchLocations } from '../features/location/locationSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';


const Dashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(fetchLocations());
    })
    return (
        <><Header /><LocationGrid title='Recently Added Locations' /></>
    );
};

export default Dashboard;
