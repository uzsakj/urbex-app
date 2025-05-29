import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Pagination, Typography } from '@mui/material';
import { ILocation } from '../interfaces/location.interface';
import LocationCard from './LocationCard';
import { getLocation } from '../services/api/location';
interface LocationGridProps {
    title?: string;
    locationsArray?: ILocation[];
}

const LocationGrid: React.FC<LocationGridProps> = ({ title, locationsArray }) => {
    const [locations, setLocations] = useState<ILocation[]>(locationsArray || []);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await getLocation();
                setLocations(data);
            } catch (err) {
                console.error('Failed to fetch locations:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

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

            {loading ? (
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
