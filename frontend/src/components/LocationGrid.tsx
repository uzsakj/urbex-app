import React from 'react';
import { Box, CircularProgress, Pagination, Typography } from '@mui/material';
import LocationCard from './LocationCard';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Status } from '../store/status.enum';
interface LocationGridProps {
    title?: string;
}

const LocationGrid: React.FC<LocationGridProps> = ({ title }) => {

    const locations = useSelector((state: RootState) => state.locations.items)
    const status = useSelector((state: RootState) => state.locations.status)


    const handleView = (id: string) => {
        // Implement routing or modal handling here
        console.log('View location with ID:', id);
    };

    return (
        <>
            {title && (
                <Typography variant="h5" gutterBottom>
                    {title}
                </Typography>
            )}

            {status === Status.LOADING ? (
                <CircularProgress />
            ) : (
                <>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 2,
                                justifyContent: 'space-between',
                            }}
                        >
                            {locations.map((loc) => (
                                <Box
                                    key={loc._id}
                                    sx={{
                                        flex: '1 0 100%',
                                        '@media (min-width:600px)': { flex: '1 0 48%' },
                                        '@media (min-width:900px)': { flex: '1 0 30%' },
                                    }}
                                >
                                    <LocationCard location={loc} onView={handleView} />
                                </Box>
                            ))}
                        </Box>
                        <Pagination count={10} color="primary" sx={{ mb: 1, display: 'flex', justifyContent: 'center' }} />
                    </Box>
                </>
            )
            }
        </>
    );
};

export default LocationGrid;
