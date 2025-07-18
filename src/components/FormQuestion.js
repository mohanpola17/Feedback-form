import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const FormQuestion = ({ question, onChange, value }) => {
  return (
    <Box mb={2}>
      {question.type === 'text' ? (
        <TextField
          label={question.text}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          fullWidth
          required
        />
      ) : (
        <FormControl fullWidth required>
          <InputLabel>{question.text}</InputLabel>
          <Select
            value={value || ''}
            label={question.text}
            onChange={e => onChange(e.target.value)}
          >
            <MenuItem value="">Select...</MenuItem>
            {question.options.map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

export default FormQuestion; 