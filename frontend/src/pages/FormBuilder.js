import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Card, CardContent, Button, Select, MenuItem, IconButton, Stack, Grid, Paper, TextField
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useSnackbar } from '../App';

const uniqueId = () => (window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
const defaultOption = () => ({ id: uniqueId(), value: '' });
const defaultQuestion = () => ({ id: uniqueId(), text: '', type: 'text', options: [defaultOption()] });

const OptionEditor = ({ options, onOptionChange, onAddOption, onRemoveOption }) => (
  <Box mt={2}>
    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>Options:</Typography>
    <Stack spacing={1} flexWrap="wrap">
      {options.map(opt => (
        <Box key={opt.id} display="flex" alignItems="center" width="100%">
          <TextField
            value={opt.value}
            onChange={e => onOptionChange(opt.id, e.target.value)}
            required
            size="small"
            fullWidth
            variant="filled"
            sx={{
              mr: 1,
              mb: 1,
              minWidth: 200,
              backgroundColor: theme => theme.palette.mode === 'dark' ? '#232323' : theme.palette.background.paper,
              input: { color: 'text.primary' },
              '& .MuiFilledInput-root': {
                backgroundColor: theme => theme.palette.mode === 'dark' ? '#232323' : theme.palette.background.paper,
              }
            }}
            color="primary"
            slotProps={{ inputLabel: { style: { color: 'var(--mui-palette-text-primary)' } } }}
          />
          {options.length > 2 && (
            <IconButton onClick={() => onRemoveOption(opt.id)} color="error" size="small">
              <RemoveCircleOutlineIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ))}
      <IconButton onClick={onAddOption} color="primary" size="small">
        <AddCircleOutlineIcon fontSize="small" />
      </IconButton>
    </Stack>
  </Box>
);

OptionEditor.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, value: PropTypes.string })).isRequired,
  onOptionChange: PropTypes.func.isRequired,
  onAddOption: PropTypes.func.isRequired,
  onRemoveOption: PropTypes.func.isRequired,
};

const FormBuilder = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    defaultQuestion(),
    defaultQuestion(),
    defaultQuestion(),
  ]);
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const handleQuestionChange = (id, field, value) => {
    setQuestions(qs =>
      qs.map(q => {
        if (q.id !== id) return q;
        if (field === 'type') {
          if (value === 'multiple-choice') {
            return { ...q, type: value, options: [defaultOption(), defaultOption()] };
          } else if (value === 'text') {
            return { ...q, type: value, options: [defaultOption()] };
          } else {
            return { ...q, type: value };
          }
        }
        if (field === 'options') {
          return { ...q, options: value };
        }
        return { ...q, [field]: value };
      })
    );
  };

  const handleOptionChange = (qId, optId, value) => {
    setQuestions(qs =>
      qs.map(q =>
        q.id === qId
          ? { ...q, options: q.options.map(opt => opt.id === optId ? { ...opt, value } : opt) }
          : q
      )
    );
  };

  const addQuestion = () => {
    if (questions.length < 5) setQuestions([...questions, defaultQuestion()]);
  };
  const removeQuestion = id => {
    if (questions.length > 3) setQuestions(qs => qs.filter(q => q.id !== id));
  };
  const addOption = qId => {
    setQuestions(qs =>
      qs.map(q =>
        q.id === qId ? { ...q, options: [...q.options, defaultOption()] } : q
      )
    );
  };
  const removeOption = (qId, optId) => {
    setQuestions(qs =>
      qs.map(q =>
        q.id === qId ? { ...q, options: q.options.filter(opt => opt.id !== optId) } : q
      )
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Validate
    if (!title.trim()) return showSnackbar('Title is required', 'error');
    if (questions.length < 3 || questions.length > 5) return showSnackbar('3-5 questions required', 'error');
    for (const q of questions) {
      if (!q.text.trim()) return showSnackbar('All questions must have text', 'error');
      if (q.type === 'multiple-choice') {
        if (q.options.length < 2) return showSnackbar('Multiple-choice questions need at least 2 options', 'error');
        if (q.options.some(opt => !opt.value.trim())) return showSnackbar('All options must have text', 'error');
      }
    }
    try {
      await api.post('/forms', {
        title,
        questions: questions.map(({ id, options, ...q }) => ({
          ...q,
          options: q.type === 'multiple-choice' ? options.map(opt => opt.value) : [],
        })),
      });
      showSnackbar('Form created! Redirecting...', 'success');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Failed to create form', 'error');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary' }}>Create Feedback Form</Typography>
      <Paper sx={{ p: 3, backgroundColor: theme => theme.palette.mode === 'dark' ? '#232323' : theme.palette.background.paper, color: 'text.primary', borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Form Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            required
            variant="filled"
            color="primary"
            sx={{ mb: 3, backgroundColor: 'background.paper', input: { color: 'text.primary' } }}
            slotProps={{ inputLabel: { style: { color: 'var(--mui-palette-text-primary)' } } }}
          />
          <Typography variant="h6" gutterBottom color="text.primary">Questions</Typography>
          <Stack spacing={2}>
            {questions.map((q, idx) => {
              const canRemove = questions.length > 3;
              return (
                <Card
                  sx={{
                    mb: 2,
                    backgroundColor: theme => theme.palette.mode === 'dark' ? '#232323' : theme.palette.background.default,
                    color: 'text.primary',
                    borderRadius: 2
                  }}
                  elevation={2}
                  key={q.id}
                >
                  <CardContent sx={{ backgroundColor: theme => theme.palette.mode === 'dark' ? '#232323' : theme.palette.background.default, color: 'text.primary', borderRadius: 2 }}>
                    <Box display="flex" alignItems="center" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={7}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }} color="text.primary">{`Question ${idx + 1}`}</Typography>
                          <TextField
                            aria-label={`Question ${idx + 1} text`}
                            value={q.text}
                            onChange={e => handleQuestionChange(q.id, 'text', e.target.value)}
                            required
                            fullWidth
                            size="small"
                            variant="filled"
                            color="primary"
                            sx={{ mb: 1, backgroundColor: theme => theme.palette.mode === 'dark' ? '#232323' : theme.palette.background.paper, input: { color: 'text.primary' }, '& .MuiFilledInput-root': { backgroundColor: theme => theme.palette.mode === 'dark' ? '#232323' : theme.palette.background.paper } }}
                            slotProps={{ inputLabel: { style: { color: 'var(--mui-palette-text-primary)' } } }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Select
                            value={q.type}
                            onChange={e => handleQuestionChange(q.id, 'type', e.target.value)}
                            aria-label={`Question ${idx + 1} type`}
                            fullWidth
                            variant="filled"
                            size="small"
                            sx={{
                              backgroundColor: theme => theme.palette.mode === 'dark' ? '#232323' : theme.palette.background.paper,
                              minHeight: '56px',
                            }}
                          >
                            <MenuItem value="text">Text</MenuItem>
                            <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                          </Select>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          {canRemove && (
                            <IconButton onClick={() => removeQuestion(q.id)} color="error" aria-label={`Remove Question ${idx + 1}`}> 
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                    {q.type === 'multiple-choice' && (
                      <OptionEditor
                        options={q.options}
                        onOptionChange={(optId, value) => handleOptionChange(q.id, optId, value)}
                        onAddOption={() => addOption(q.id)}
                        onRemoveOption={optId => removeOption(q.id, optId)}
                      />
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
          {questions.length < 5 && (
            <Button onClick={addQuestion} startIcon={<AddCircleOutlineIcon />} sx={{ mt: 2 }} color="secondary" >
              Add Question
            </Button>
          )}
          <Box mt={3}>
            <Button type="submit" variant="contained" color="primary" sx={{ color: 'white' }}>
              Create Form
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default FormBuilder; 