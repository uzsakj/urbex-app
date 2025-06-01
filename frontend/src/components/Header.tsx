import React, { useState } from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Toolbar,
    AppBar,
    Typography,
    Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const menuItems = [
    { text: 'Home', to: '/' },
    { text: 'Profile', to: '/profile' },
    { text: 'Explore', to: '/explore' }
];

const Header: React.FC = () => {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (state: boolean) => () => {
        setOpen(state);
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div">
                        UrbexHub
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} component={Link} to={item.to} sx={{ padding: '10px' }}>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default Header;
