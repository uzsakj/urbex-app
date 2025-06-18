import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
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

    return (
        <>
            {status === Status.LOADING ? (
                <CircularProgress />
            ) : (
                <>
                    <Box
                        sx={{
                            display: 'flex',
                            flexGrow: 1,
                            flexDirection: 'column',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            p: 3
                        }}
                    >
                        {title && (
                            <Typography variant="h5" gutterBottom sx={{ display: 'block', width: 'fit-content', mx: 'auto', pt: 2 }}>
                                {title}
                            </Typography>
                        )}

                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 2,
                                justifyContent: 'space-between',
                            }}
                        >

                            {locations?.map((loc) => (
                                <Box
                                    key={loc._id}
                                    sx={{
                                        flex: '1 0 100%',
                                        '@media (min-width:600px)': { flex: '1 0 48%' },
                                        '@media (min-width:900px)': { flex: '1 0 30%' },
                                    }}
                                >
                                    <LocationCard location={loc} />
                                </Box>
                            ))}

                            {locations.length === 0 && <Typography sx={{ display: 'block', width: 'fit-content', mx: 'auto' }}>No locations to display</Typography>}
                        </Box>

                    </Box>
                </>
            )
            }
        </>
    );
};

export default LocationGrid;
