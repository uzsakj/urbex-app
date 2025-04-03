import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom v6

const Home: React.FC = () => {
    const navigate = useNavigate(); // Use navigate for routing

    // Handler to navigate to login
    const goToLogin = () => {
        navigate('/login');
    };

    // Handler to navigate to register
    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',   // Stack elements vertically
                    alignItems: 'center',      // Center items horizontally
                    justifyContent: 'center',  // Optional: Vertically center the content (if you want full page center)
                    height: '100vh',           // Make sure the Box takes full viewport height
                    textAlign: 'center',       // Ensure text is centered
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Welcome to Our App
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Please choose an option to continue.
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, width: '100%' }}  // Ensuring buttons are full width within the container
                    onClick={goToLogin} // Navigate to login
                >
                    Go to Login
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 2, width: '100%' }} // Ensure buttons are full width
                    onClick={goToRegister} // Navigate to register
                >
                    Go to Sign Up
                </Button>
            </Box>
        </Container>
    );
};

export default Home;
