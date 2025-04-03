import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate('/login');
    };

    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                position: 'relative',
                backgroundImage: 'url(/urbex.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                overflow: 'hidden',
            }}
        >
            <Box sx={{
                backgroundColor: 'rgba(255, 254, 254, 0.7)',
                padding: '20px',
                borderRadius: '8px',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)'
            }}>
                <Typography variant="h4" gutterBottom >
                    Welcome to UrbexHub
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Please Log in or Sign up to continue.
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, width: '100%' }}
                    onClick={goToLogin}
                >
                    Log in
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 2, width: '100%' }}
                    onClick={goToRegister}
                >
                    Sign Up
                </Button>
            </Box>
        </Box>
    );
};

export default Home;
