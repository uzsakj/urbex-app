import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Snackbar,
    Alert,
    Avatar,
    Badge,
    IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { updateProfile, getProfile, createProfile } from '../services/api/profile';
import { IProfile } from '../interfaces/profile.interface';
import AddIcon from '@mui/icons-material/Add';

const ProfileForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<IProfile>({
        fullName: '',
        biography: '',
        province: '',
        avatarUrl: ''
    });


    const [initialData, setInitialData] = useState<IProfile | null>(null);
    const [profileExists, setProfileExists] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        if (avatarFile) {
            const objectUrl = URL.createObjectURL(avatarFile);
            setAvatarUrl(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [avatarFile]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getProfile();
                console.error(123, profile)
                if (profile) {
                    setFormData({
                        fullName: profile.fullName || '',
                        biography: profile.biography || '',
                        province: profile.province || '',
                        avatarUrl: profile.avatarUrl || '',
                    });
                    setInitialData(profile)
                    setAvatarUrl(profile.avatarUrl || null);
                    setProfileExists(true);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setProfileExists(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            setSnackbarMessage('You must be logged in to update your profile.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        try {
            const hasChanges = (
                formData.fullName !== initialData?.fullName ||
                formData.biography !== initialData?.biography ||
                formData.province !== initialData?.province ||
                avatarFile
            );

            if (!hasChanges) {
                setSnackbarMessage('No changes to save.');
                setSnackbarSeverity('info');
                setSnackbarOpen(true);
                return;
            }

            const formDataToSend = new FormData();
            if (formData.fullName !== undefined) {
                formDataToSend.append('fullName', formData.fullName);
            }
            if (formData.biography !== undefined) {
                formDataToSend.append('biography', formData.biography);
            }
            if (formData.province !== undefined) {
                formDataToSend.append('province', formData.province);
            }
            if (avatarFile) {
                formDataToSend.append('avatar', avatarFile, avatarFile.name);
            }


            if (profileExists) {
                await updateProfile(formDataToSend);
            } else {
                await createProfile(formDataToSend);
            }

            setSnackbarMessage(profileExists ? 'Profile updated successfully!' : 'Profile created successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            navigate('/');
        } catch (error) {
            console.error(error);
            setSnackbarMessage(`Something went wrong. ${error}`);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSkip = () => {
        navigate('/');
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
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
            <Paper
                elevation={3}
                sx={{
                    backgroundColor: 'rgba(255, 254, 254, 1)',
                    padding: '20px',
                    borderRadius: '8px',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                    width: '100%',
                    maxWidth: '400px',
                }}
            >
                <Typography variant="h5" align="center" gutterBottom>
                    Profile Form
                </Typography>

                <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
                    We'd love to get to know you! Please fill out your profile. Nothing is required; all fields are optional and only used to help personalize your experience.
                </Typography>

                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                        <IconButton component="label" color="primary" sx={{ bgcolor: 'white' }}>
                            <AddIcon />
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        setAvatarFile(e.target.files[0]);
                                    }
                                }}
                            />
                        </IconButton>
                    }
                >
                    <Avatar
                        src={avatarUrl || undefined}
                        sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                    />
                </Badge>


                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />

                    <TextField
                        label="Biography"
                        name="biography"
                        value={formData.biography}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        variant="outlined"
                    />

                    <TextField
                        label="Province"
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3, backgroundColor: '#03a9f4' }}
                    >
                        Save Profile
                    </Button>
                    <Button
                        onClick={handleSkip}
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3, backgroundColor: '#757575' }}
                    >
                        Maybe later
                    </Button>
                </Box>
            </Paper>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProfileForm;
