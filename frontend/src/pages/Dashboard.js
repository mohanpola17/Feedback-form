import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Container, Typography, Button, Box, Card, CardContent, CardActions, Avatar, Grid, Divider, CircularProgress } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';

const FormCard = ({ form }) => (
  <Card sx={{ mb: 2, backgroundColor: theme => theme.palette.mode === 'dark' ? '#232323' : theme.palette.background.default, color: 'text.primary' }} elevation={3}>
    <CardContent>
      <Box display="flex" alignItems="center" gap={2} sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }} aria-label="form-avatar">
          <AssignmentIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'text.primary' }}>{form.title}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Share link: <code>{`${window.location.origin}/forms/public/${form._id}`}</code>
          </Typography>
        </Box>
      </Box>
    </CardContent>
    <Divider />
    <CardActions>
      <Button component={Link} to={`/forms/${form._id}/responses`} variant="contained" color="secondary" size="small" aria-label="View Responses" sx={{ color: 'white' }}>
        View Responses
      </Button>
    </CardActions>
  </Card>
);

FormCard.propTypes = {
  form: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await api.get('/forms');
        setForms(res.data.forms); // <-- updated for paginated response
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
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary' }}>Admin Dashboard</Typography>
      <Box sx={{ mb: 3 }}>
        <Button component={Link} to="/forms/new" variant="contained" color="primary" aria-label="Create New Form" sx={{ color: 'white' }}>
          Create New Form
        </Button>
      </Box>
      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>Your Forms</Typography>
      <Divider sx={{ mb: 2 }} />
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : forms.length === 0 ? (
        <Typography>No forms created yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {forms.map(form => (
            <Grid item xs={12} sm={6} md={4} key={form._id}>
              <FormCard form={form} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard; 