import React, { useState, useEffect, FormEvent } from 'react';
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
import AddIcon from '@mui/icons-material/Add';
import { Profile } from '../features/profile/types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchProfile, saveProfile } from '../features/profile/profileSlice';
import { countries } from '../constants/countries';
const ProfileForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const profile = useSelector((state: RootState) => state.profile)

    const [formData, setFormData] = useState<Profile>(profile.data || {
        fullName: '',
        biography: '',
        gender: '',
        birthDate: '',
        country: '',
        city: '',
        avatarUrl: '',
    });

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const today = new Date().toISOString().split('T')[0];
    useEffect(() => {
        if (avatarFile) {
            const objectUrl = URL.createObjectURL(avatarFile);
            setAvatarUrl(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [avatarFile]);

    useEffect(() => {
        dispatch(fetchProfile('me'));
    }, [dispatch]);

    useEffect(() => {
        if (profile.data) {
            setFormData({
                fullName: profile.data.fullName || '',
                biography: profile.data.biography || '',
                gender: profile.data.gender || '',
                birthDate: profile.data.birthDate || '',
                country: profile.data.country || '',
                city: profile.data.city || '',
                avatarUrl: profile.data.avatarUrl || '',
            });
            setAvatarUrl(profile.data.avatarUrl || '')
        }
    }, [profile.data])


    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const authToken = localStorage.getItem('token');
        if (!authToken) {
            setSnackbarMessage('You must be logged in to update your profile.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        try {
            const hasChanges = (
                formData.fullName !== profile.data?.fullName ||
                formData.biography !== profile.data?.biography ||
                formData.country !== profile.data?.country ||
                formData.birthDate !== profile.data?.birthDate ||
                formData.city !== profile.data?.city ||
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
            if (formData.gender !== undefined) {
                formDataToSend.append('gender', formData.gender);
            }
            if (formData.birthDate !== undefined) {
                formDataToSend.append('birthDate', formData.birthDate);
            }
            if (formData.country !== undefined) {
                formDataToSend.append('country', formData.country);
            }
            if (formData.city !== undefined) {
                formDataToSend.append('city', formData.city);
            }

            if (avatarFile) {
                formDataToSend.append('avatar', avatarFile, avatarFile.name);
            }


            await dispatch(saveProfile(formDataToSend))


            setSnackbarMessage(profile.data ? 'Profile updated successfully!' : 'Profile created successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            setSnackbarMessage(`Something went wrong. ${error}`);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSkip = () => {
        navigate('/dashboard');
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                overflow: 'auto',
                padding: 2,
                boxSizing: 'border-box',
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
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        slotProps={{ inputLabel: { shrink: Boolean(formData.fullName) } }}
                    />

                    <TextField
                        select
                        label="Gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        slotProps={{ select: { native: true }, inputLabel: { shrink: Boolean(formData.gender) } }}

                    >
                        <option value="" disabled></option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-binary</option>
                        <option value="other">Other</option>
                    </TextField>

                    <TextField
                        label="Date of Birth"
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        slotProps={{
                            inputLabel: { shrink: true },
                            htmlInput: { max: today }
                        }}
                    />

                    <TextField
                        select
                        label="Country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        slotProps={{ select: { native: true }, inputLabel: { shrink: Boolean(formData.gender) } }}
                    >
                        <option value="" disabled></option>
                        {countries.map((country) => (
                            <option key={country} value={country}>
                                {country}
                            </option>
                        ))}
                    </TextField>

                    <TextField
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        slotProps={{ inputLabel: { shrink: Boolean(formData.fullName) } }}
                    />

                    <TextField
                        label="Biography"
                        name="biography"
                        value={formData.biography}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        variant="outlined"
                        slotProps={{ inputLabel: { shrink: Boolean(formData.fullName) } }}
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


