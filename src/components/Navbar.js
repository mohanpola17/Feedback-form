import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, removeToken } from '../utils/auth';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };
  return (
    <AppBar position="static" color="default" elevation={1} sx={{ mb: 3 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }} component={Link} to="/" color="inherit" style={{ textDecoration: 'none' }}>
          Feedback Platform
        </Typography>
        <Box>
          {isAuthenticated() ? (
            <>
              <Button component={Link} to="/dashboard" color="inherit">Dashboard</Button>
              <Button component={Link} to="/forms/new" color="inherit">Create Form</Button>
              <Button onClick={handleLogout} color="inherit">Logout</Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" color="inherit">Login</Button>
              <Button component={Link} to="/register" color="inherit">Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 