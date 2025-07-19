import React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, removeToken } from '../utils/auth';
import { AppBar, Toolbar, Button, Box, Typography, IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = ({ mode, toggleMode }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };
  return (
    <AppBar position="static" color="default" elevation={1} sx={{ mb: 3 }}>
      <Toolbar sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' } }}>
        <Typography variant="h6" sx={{ flexGrow: 1, mb: { xs: 1, sm: 0 } }} component={Link} to="/" color="inherit" style={{ textDecoration: 'none' }} aria-label="Home">
          Feedback Platform
        </Typography>
        <Box>
          <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
            <IconButton onClick={toggleMode} color="inherit" sx={{ mr: 1 }} aria-label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Tooltip>
          {isAuthenticated() ? (
            <>
              <Button component={Link} to="/dashboard" color="inherit" aria-label="Dashboard">Dashboard</Button>
              <Button component={Link} to="/forms/new" color="inherit" aria-label="Create Form">Create Form</Button>
              <Button onClick={handleLogout} color="inherit" aria-label="Logout">Logout</Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" color="inherit" aria-label="Login">Login</Button>
              <Button component={Link} to="/register" color="inherit" aria-label="Register">Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  mode: PropTypes.oneOf(['light', 'dark']).isRequired,
  toggleMode: PropTypes.func.isRequired,
};

export default Navbar; 