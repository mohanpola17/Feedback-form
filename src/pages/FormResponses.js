import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import {
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Alert, CircularProgress, Box, List, ListItem, ListItemText
} from '@mui/material';

const FormResponses = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formRes, respRes, summaryRes] = await Promise.all([
          api.get(`/forms/public/${formId}`),
          api.get(`/forms/${formId}/responses`),
          api.get(`/forms/${formId}/summary`),
        ]);
        setForm(formRes.data);
        setResponses(respRes.data);
        setSummary(summaryRes.data.summary);
      } catch (err) {
        setError('Failed to load responses');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [formId]);

  const handleExportCSV = async () => {
    try {
      const res = await api.get(`/forms/${formId}/export`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${form?.title || 'responses'}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export CSV');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Form Responses</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : !form ? (
        <Typography>Form not found.</Typography>
      ) : (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>{form.title}</Typography>
          <Button onClick={handleExportCSV} variant="contained" sx={{ mb: 3 }}>Export as CSV</Button>
          <Typography variant="h6">Responses ({responses.length})</Typography>
          {responses.length === 0 ? (
            <Typography>No responses yet.</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {form.questions.map((q, idx) => (
                      <TableCell key={idx}>{q.text}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {responses.map((resp, ri) => (
                    <TableRow key={ri}>
                      {resp.answers.map((ans, ai) => (
                        <TableCell key={ai}>{ans}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Typography variant="h6">Summary</Typography>
          <Box>
            <List>
              {summary.map((q, idx) => (
                <ListItem key={idx} alignItems="flex-start" sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography fontWeight="bold">{q.question} ({q.type})</Typography>
                  {q.type === 'text' ? (
                    <List sx={{ pl: 2 }}>
                      {q.responses.slice(0, 3).map((resp, i) => (
                        <ListItem key={i}>
                          <ListItemText primary={resp} />
                        </ListItem>
                      ))}
                      {q.responses.length > 3 && <ListItem><ListItemText primary={`...and ${q.responses.length - 3} more`} /></ListItem>}
                    </List>
                  ) : (
                    <List sx={{ pl: 2 }}>
                      {Object.entries(q.counts).map(([opt, count]) => (
                        <ListItem key={opt}>
                          <ListItemText primary={`${opt}: ${count}`} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        </>
      )}
    </Container>
  );
};

export default FormResponses; 