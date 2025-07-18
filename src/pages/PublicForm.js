import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import FormQuestion from '../components/FormQuestion';
import { Container, Typography, Paper, Button, Alert, CircularProgress, Box } from '@mui/material';

const PublicForm = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setError('');
    setSuccess('');
    if (answers.some(ans => !ans)) return setError('Please answer all questions');
    try {
      await api.post(`/forms/public/${formId}/response`, { answers });
      setSuccess('Thank you for your feedback!');
      setAnswers(Array(form.questions.length).fill(''));
    } catch (err) {
      setError('Failed to submit feedback');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : !form ? (
        <Typography>Form not found.</Typography>
      ) : (
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>{form.title}</Typography>
          <form onSubmit={handleSubmit}>
            {form.questions.map((q, idx) => (
              <FormQuestion
                key={idx}
                question={q}
                value={answers[idx]}
                onChange={val => handleChange(idx, val)}
              />
            ))}
            <Box mt={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit Feedback
              </Button>
            </Box>
          </form>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </Paper>
      )}
    </Container>
  );
};

export default PublicForm; 