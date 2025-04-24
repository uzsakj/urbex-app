import React, { useState, FormEvent } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth.ts';
const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const payload = { email, password }
            const data = await login(payload)
            setError(null);
            localStorage.setItem('authToken', data.token);
            if (data.profileIncomplete) {
                navigate('/profile');
            } else {
                navigate('/dashboard');
            }
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
                    Login
                </Typography>

                <form onSubmit={handleSubmit}>
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
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, backgroundColor: '#757575' }}>
                        Login
                    </Button>
                </form>

                <Button
                    onClick={() => navigate('/register')}
                    color="primary"
                    sx={{ mt: 2 }}
                >
                    Don't have an account? Register
                </Button>
            </Box>
        </Box>
    );
};

export default Login;
