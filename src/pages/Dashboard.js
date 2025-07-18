import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Container, Typography, Button, Box, Paper, Alert, CircularProgress } from '@mui/material';

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await api.get('/forms');
        setForms(res.data);
      } catch (err) {
        setError('Failed to load forms');
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Box sx={{ mb: 3 }}>
        <Button component={Link} to="/forms/new" variant="contained" color="primary">
          Create New Form
        </Button>
      </Box>
      <Typography variant="h6" gutterBottom>Your Forms</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : forms.length === 0 ? (
        <Typography>No forms created yet.</Typography>
      ) : (
        <Box>
          {forms.map(form => (
            <Paper key={form._id} sx={{ p: 2, mb: 2 }} elevation={2}>
              <Typography variant="subtitle1" fontWeight="bold">{form.title}</Typography>
              <Box sx={{ mt: 1, mb: 1 }}>
                <Button component={Link} to={`/forms/${form._id}/responses`} variant="outlined" size="small" sx={{ mr: 2 }}>
                  View Responses
                </Button>
                <Typography variant="body2" component="span">
                  Share link: <code>{`${window.location.origin}/forms/public/${form._id}`}</code>
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Dashboard; 