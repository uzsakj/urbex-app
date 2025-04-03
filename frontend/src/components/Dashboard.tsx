import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                backgroundColor: 'white',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Welcome to the Dashboard
            </Typography>
            <Typography variant="body1" gutterBottom>
                This is a private area only accessible to logged-in users.
            </Typography>

            <Button variant="contained" onClick={handleLogout} sx={{ backgroundColor: '#03a9f4' }}>
                Logout
            </Button>
        </Box>
    );
};

export default Dashboard;
