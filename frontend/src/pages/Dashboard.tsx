import React, { useEffect, useState } from 'react';
import LocationGrid from '../components/LocationGrid';
import { SelectChangeEvent, Typography, Select, MenuItem, Pagination, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLocationsPaginated } from '../features/location/locationSlice';
import { RootState, AppDispatch } from '../store';


const Dashboard: React.FC = () => {
    const total = useSelector((state: RootState) => state.locations.total)
    const [perPage, setPerPage] = useState<number>(10)
    const [page, setPage] = useState<number>(1)

    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(fetchLocationsPaginated({ page, limit: perPage }));
    }, [dispatch, page, perPage])

    const handlePerPageChange = (event: SelectChangeEvent<number>) => {
        const newSize = Number(event.target.value);
        setPerPage(newSize);
        setPage(1);
    };
    return (
        <>
            <Box sx={{
                display: 'flex',
                height: '100%',
                width: '100%',
                flexDirection: 'column',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }}>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    height: 'fit-content',
                    p: 2,
                    pb: 1
                }}>

                    <Typography sx={{ mr: 1, }}>Items per page:</Typography>
                    <Select
                        value={perPage}
                        onChange={handlePerPageChange}
                        size="small"
                        sx={{ width: 80 }}
                    >
                        {[10, 20, 30, 50].map((n) => (
                            <MenuItem key={n} value={n}>
                                {n}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                <LocationGrid title="Recently Added Locations" />
                <Pagination
                    count={Math.ceil(total / perPage)}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    sx={{
                        mb: 1,
                        display: 'flex',
                        justifyContent: 'center'
                    }} />
            </Box>
        </>
    );
};

export default React.memo(Dashboard);
