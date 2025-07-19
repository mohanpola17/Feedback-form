import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../App';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { email, password });
      showSnackbar('Registration successful! Please login.', 'success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Registration failed', 'error');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, p: { xs: 2, sm: 4 }, boxShadow: 3, borderRadius: 2, backgroundColor: theme => theme.palette.mode === 'dark' ? '#232323' : theme.palette.background.paper, color: 'text.primary' }}>
        <Typography variant="h4" align="center" gutterBottom color="text.primary">Register</Typography>
        <form onSubmit={handleSubmit} aria-label="Register Form">
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            variant="filled"
            sx={{ bgcolor: 'background.paper', input: { color: 'text.primary' } }}
            slotProps={{ inputLabel: { style: { color: 'var(--mui-palette-text-primary)' } } }}
            inputProps={{ 'aria-label': 'Email' }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            variant="filled"
            sx={{ bgcolor: 'background.paper', input: { color: 'text.primary' } }}
            slotProps={{ inputLabel: { style: { color: 'var(--mui-palette-text-primary)' } } }}
            inputProps={{ 'aria-label': 'Password' }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} aria-label="Register">
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

Register.propTypes = {};

export default Register; 