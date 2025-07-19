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

const defaultQuestion = () => ({ text: '', type: 'text', options: [''] });

const OptionEditor = ({ options, onOptionChange, onAddOption, onRemoveOption }) => (
  <Box mt={2}>
    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>Options:</Typography>
    <Stack direction="row" spacing={1} flexWrap="wrap">
      {options.map((opt, oi) => (
        <Box key={oi} display="flex" alignItems="center">
          <TextField
            value={opt}
            onChange={e => onOptionChange(oi, e.target.value)}
            required
            size="small"
            sx={{ mr: 1, mb: 1 }}
            color="primary"
            slotProps={{ inputLabel: { style: { color: 'var(--mui-palette-text-primary)' } } }}
          />
          {options.length > 2 && (
            <IconButton onClick={() => onRemoveOption(oi)} color="error" size="small">
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
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onOptionChange: PropTypes.func.isRequired,
  onAddOption: PropTypes.func.isRequired,
  onRemoveOption: PropTypes.func.isRequired,
};

const QuestionEditor = ({ q, idx, onQuestionChange, onOptionChange, onAddOption, onRemoveOption, onRemoveQuestion, canRemove }) => (
  <Card sx={{ mb: 2, backgroundColor: theme => theme.palette.mode === 'dark' ? '#232323' : theme.palette.background.paper, color: 'text.primary', borderRadius: 2 }} elevation={2}>
    <CardContent sx={{ backgroundColor: theme => theme.palette.mode === 'dark' ? '#232323' : theme.palette.background.default, color: 'text.primary', borderRadius: 2 }}>
      <Box display="flex" alignItems="center" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={7}>
            <Typography variant="subtitle2" sx={{ mb: 1 }} color="text.primary">{`Question ${idx + 1}`}</Typography>
            <TextField
              aria-label={`Question ${idx + 1} text`}
              value={q.text}
              onChange={e => onQuestionChange(idx, 'text', e.target.value)}
              required
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              color="primary"
              slotProps={{ inputLabel: { style: { color: 'var(--mui-palette-text-primary)' } } }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Select
              value={q.type}
              onChange={e => onQuestionChange(idx, 'type', e.target.value)}
              aria-label={`Question ${idx + 1} type`}
              fullWidth
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={2}>
            {canRemove && (
              <IconButton onClick={() => onRemoveQuestion(idx)} color="error" aria-label={`Remove Question ${idx + 1}`}> 
                <RemoveCircleOutlineIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      </Box>
      {q.type === 'multiple-choice' && (
        <Box mt={2}>
          <Typography variant="subtitle2" color="text.primary">Options:</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {q.options.map((opt, oi) => (
              <Box key={oi} display="flex" alignItems="center">
                <TextField
                  aria-label={`Option ${oi + 1} for Question ${idx + 1}`}
                  value={opt}
                  onChange={e => onOptionChange(idx, oi, e.target.value)}
                  required
                  size="small"
                  sx={{ width: 120, mr: 1, mb: 1 }}
                  color="primary"
                  slotProps={{ inputLabel: { style: { color: 'var(--mui-palette-text-primary)' } } }}
                />
                {q.options.length > 2 && (
                  <IconButton onClick={() => onRemoveOption(idx, oi)} color="error" size="small" aria-label={`Remove Option ${oi + 1} for Question ${idx + 1}`}>
                    <RemoveCircleOutlineIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ))}
            <IconButton onClick={() => onAddOption(idx)} color="primary" size="small" aria-label={`Add Option to Question ${idx + 1}`}>
              <AddCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      )}
    </CardContent>
  </Card>
);

QuestionEditor.propTypes = {
  q: PropTypes.shape({
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  idx: PropTypes.number.isRequired,
  onQuestionChange: PropTypes.func.isRequired,
  onOptionChange: PropTypes.func.isRequired,
  onAddOption: PropTypes.func.isRequired,
  onRemoveOption: PropTypes.func.isRequired,
  onRemoveQuestion: PropTypes.func.isRequired,
  canRemove: PropTypes.bool.isRequired,
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
    // Validate
    if (!title.trim()) return showSnackbar('Title is required', 'error');
    if (questions.length < 3 || questions.length > 5) return showSnackbar('3-5 questions required', 'error');
    for (const q of questions) {
      if (!q.text.trim()) return showSnackbar('All questions must have text', 'error');
      if (q.type === 'multiple-choice') {
        if (q.options.length < 2) return showSnackbar('Multiple-choice questions need at least 2 options', 'error');
        if (q.options.some(opt => !opt.trim())) return showSnackbar('All options must have text', 'error');
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
                  key={idx}
                >
                  <CardContent sx={{ backgroundColor: theme => theme.palette.mode === 'dark' ? '#232323' : theme.palette.background.default, color: 'text.primary', borderRadius: 2 }}>
                    <Box display="flex" alignItems="center" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={7}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }} color="text.primary">{`Question ${idx + 1}`}</Typography>
                          <TextField
                            aria-label={`Question ${idx + 1} text`}
                            value={q.text}
                            onChange={e => handleQuestionChange(idx, 'text', e.target.value)}
                            required
                            fullWidth
                            size="small"
                            sx={{ mb: 1 }}
                            color="primary"
                            slotProps={{ inputLabel: { style: { color: 'var(--mui-palette-text-primary)' } } }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Select
                            value={q.type}
                            onChange={e => handleQuestionChange(idx, 'type', e.target.value)}
                            aria-label={`Question ${idx + 1} type`}
                            fullWidth
                          >
                            <MenuItem value="text">Text</MenuItem>
                            <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                          </Select>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          {canRemove && (
                            <IconButton onClick={() => removeQuestion(idx)} color="error" aria-label={`Remove Question ${idx + 1}`}> 
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                    {q.type === 'multiple-choice' && (
                      <Box mt={2}>
                        <Typography variant="subtitle2" color="text.primary">Options:</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {q.options.map((opt, oi) => (
                            <Box key={oi} display="flex" alignItems="center">
                              <TextField
                                aria-label={`Option ${oi + 1} for Question ${idx + 1}`}
                                value={opt}
                                onChange={e => handleOptionChange(idx, oi, e.target.value)}
                                required
                                size="small"
                                sx={{ width: 120, mr: 1, mb: 1 }}
                                color="primary"
                                slotProps={{ inputLabel: { style: { color: 'var(--mui-palette-text-primary)' } } }}
                              />
                              {q.options.length > 2 && (
                                <IconButton onClick={() => removeOption(idx, oi)} color="error" size="small" aria-label={`Remove Option ${oi + 1} for Question ${idx + 1}`}>
                                  <RemoveCircleOutlineIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          ))}
                          <IconButton onClick={() => addOption(idx)} color="primary" size="small" aria-label={`Add Option to Question ${idx + 1}`}>
                            <AddCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Box>
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