import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, TextField, Button, Select, MenuItem, IconButton, Alert, Stack
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const defaultQuestion = () => ({ text: '', type: 'text', options: [''] });

const FormBuilder = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    defaultQuestion(),
    defaultQuestion(),
    defaultQuestion(),
  ]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleQuestionChange = (idx, field, value) => {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === idx ? { ...q, [field]: value, ...(field === 'type' && value === 'text' ? { options: [''] } : {}) } : q
      )
    );
  };

  const handleOptionChange = (qIdx, optIdx, value) => {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((opt, oi) => (oi === optIdx ? value : opt)) }
          : q
      )
    );
  };

  const addQuestion = () => {
    if (questions.length < 5) setQuestions([...questions, defaultQuestion()]);
  };
  const removeQuestion = idx => {
    if (questions.length > 3) setQuestions(questions.filter((_, i) => i !== idx));
  };
  const addOption = idx => {
    setQuestions(qs =>
      qs.map((q, i) => (i === idx ? { ...q, options: [...q.options, ''] } : q))
    );
  };
  const removeOption = (qIdx, optIdx) => {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === qIdx ? { ...q, options: q.options.filter((_, oi) => oi !== optIdx) } : q
      )
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Validate
    if (!title.trim()) return setError('Title is required');
    if (questions.length < 3 || questions.length > 5) return setError('3-5 questions required');
    for (const q of questions) {
      if (!q.text.trim()) return setError('All questions must have text');
      if (q.type === 'multiple-choice') {
        if (q.options.length < 2) return setError('Multiple-choice questions need at least 2 options');
        if (q.options.some(opt => !opt.trim())) return setError('All options must have text');
      }
    }
    try {
      await api.post('/forms', {
        title,
        questions: questions.map(q => ({
          text: q.text,
          type: q.type,
          options: q.type === 'multiple-choice' ? q.options : [],
        })),
      });
      setSuccess('Form created! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create form');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Create Feedback Form</Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Form Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
          />
          <Typography variant="h6" gutterBottom>Questions</Typography>
          <Stack spacing={2}>
            {questions.map((q, idx) => (
              <Paper key={idx} sx={{ p: 2, position: 'relative' }} elevation={1}>
                <Box display="flex" alignItems="center" gap={2}>
                  <TextField
                    label={`Question ${idx + 1}`}
                    value={q.text}
                    onChange={e => handleQuestionChange(idx, 'text', e.target.value)}
                    required
                    fullWidth
                  />
                  <Select
                    value={q.type}
                    onChange={e => handleQuestionChange(idx, 'type', e.target.value)}
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                  </Select>
                  {questions.length > 3 && (
                    <IconButton onClick={() => removeQuestion(idx)} color="error">
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  )}
                </Box>
                {q.type === 'multiple-choice' && (
                  <Box mt={2}>
                    <Typography variant="subtitle2">Options:</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {q.options.map((opt, oi) => (
                        <Box key={oi} display="flex" alignItems="center">
                          <TextField
                            value={opt}
                            onChange={e => handleOptionChange(idx, oi, e.target.value)}
                            required
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                          {q.options.length > 2 && (
                            <IconButton onClick={() => removeOption(idx, oi)} color="error" size="small">
                              <RemoveCircleOutlineIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      ))}
                      <IconButton onClick={() => addOption(idx)} color="primary" size="small">
                        <AddCircleOutlineIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                )}
              </Paper>
            ))}
          </Stack>
          {questions.length < 5 && (
            <Button onClick={addQuestion} startIcon={<AddCircleOutlineIcon />} sx={{ mt: 2 }}>
              Add Question
            </Button>
          )}
          <Box mt={3}>
            <Button type="submit" variant="contained" color="primary">
              Create Form
            </Button>
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </form>
      </Paper>
    </Container>
  );
};

export default FormBuilder; 