import React, { useState, FormEvent } from 'react';
import { Button, TextField, Typography, Box, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api/auth.ts';

const Register: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const payload = { username, email, password }
            await register(payload)
            setError(null);
            setSnackbarMessage('Registration successful! Redirecting to login...');
            setOpenSnackbar(true);

            // Navigate to login after 5 seconds
            setTimeout(() => {
                navigate('/login');
            }, 5000);
        } catch (err) {
            setError(`Error occurred: ${err}`);
        }
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
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'rgba(255, 254, 254, 1)',
                    padding: '20px',
                    borderRadius: '8px',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                    width: '100%',
                    maxWidth: '400px',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Register
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        variant="filled"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        variant="filled"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        variant="filled"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, backgroundColor: '#03a9f4' }}>
                        Register
                    </Button>
                </form>

                <Button
                    onClick={() => navigate('/login')}
                    color="primary"
                    sx={{ mt: 2 }}
                >
                    Already have an account? Login
                </Button>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
            />
        </Box>
    );
};

export default Register;
