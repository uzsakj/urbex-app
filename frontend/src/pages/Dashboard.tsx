import React from 'react';
import Header from './Header';
import LocationGrid from '../components/LocationGrid';


const Dashboard: React.FC = () => {


    return (
        <><Header /><LocationGrid title='Recently Added Locations' /></>
    );
};

export default Dashboard;
