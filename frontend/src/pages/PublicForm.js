import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import FormQuestion from '../components/FormQuestion';
import { Container, Typography, Card, CardContent, Button, CircularProgress, Box, Grid } from '@mui/material';
import { useSnackbar } from '../App';

const PublicForm = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const showSnackbar = useSnackbar();

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await api.get(`/forms/public/${formId}`);
        setForm(res.data);
        setAnswers(Array(res.data.questions.length).fill(''));
      } catch (err) {
        setError('Form not found');
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  const handleChange = (idx, value) => {
    setAnswers(ans => ans.map((a, i) => (i === idx ? value : a)));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (answers.some(ans => !ans)) return showSnackbar('Please answer all questions', 'error');
    try {
      await api.post(`/forms/public/${formId}/response`, { answers });
      showSnackbar('Thank you for your feedback!', 'success');
      setAnswers(Array(form.questions.length).fill(''));
    } catch (err) {
      showSnackbar('Failed to submit feedback', 'error');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : !form ? (
        <Typography>Form not found.</Typography>
      ) : (
        <Card sx={{ p: { xs: 2, sm: 4 }, backgroundColor: theme => theme.palette.mode === 'dark' ? '#232323' : theme.palette.background.paper, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom color="text.primary">{form.title}</Typography>
            <form onSubmit={handleSubmit} aria-label="Public Feedback Form">
              <Grid container spacing={2}>
                {form.questions.map((q, idx) => (
                  <Grid item xs={12} key={idx}>
                    <Box sx={{ backgroundColor: theme => theme.palette.mode === 'dark' ? '#232323' : theme.palette.background.default, color: 'text.primary', p: 2, borderRadius: 2 }}>
                      <FormQuestion
                        question={q}
                        value={answers[idx]}
                        onChange={val => handleChange(idx, val)}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Box mt={2}>
                <Button type="submit" variant="contained" color="primary" fullWidth aria-label="Submit Feedback" sx={{ color: 'white' }}>
                  Submit Feedback
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

PublicForm.propTypes = {};

export default PublicForm; 