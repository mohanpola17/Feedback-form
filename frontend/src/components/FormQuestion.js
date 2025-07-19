import React from 'react';
import PropTypes from 'prop-types';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const FormQuestion = ({ question, onChange, value }) => {
  let inputComponent;
  switch (question.type) {
    case 'text':
      inputComponent = (
        <TextField
          label={question.text}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          fullWidth
          required
        />
      );
      break;
    case 'select':
      inputComponent = (
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
      );
      break;
    default:
      inputComponent = <div>Unsupported question type</div>;
  }
  return <Box mb={2}>{inputComponent}</Box>;
};

FormQuestion.propTypes = {
  question: PropTypes.shape({
    type: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
};

export default FormQuestion; 