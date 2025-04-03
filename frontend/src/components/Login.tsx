import React, { useState, FormEvent } from 'react';
import { Button, TextField, Typography, Container, Grid, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const apiDomain: string = import.meta.env.VITE_API_DOMAIN || '';
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const payload = { email, password };

        try {
            const response = await fetch(`${apiDomain}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setError(null)
                navigate('/');
            } else {
                setError(data.message || data.error || 'Something went wrong');
            }
        } catch (err) {
            setError(`Error occured: ${err}`);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Container component="main" maxWidth="xs">
                <Paper elevation={3} sx={{ padding: 3 }}>
                    <Typography variant="h5" component="h1" gutterBottom>
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
                        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3 }}>
                            Login
                        </Button>
                    </form>

                    <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Grid>
                            <Button onClick={() => navigate('/register')} color="primary">
                                Don't have an account? Register
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
