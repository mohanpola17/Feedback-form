import React, { useState, useMemo, createContext, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import FormResponses from './pages/FormResponses';
import PublicForm from './pages/PublicForm';
import { isAuthenticated } from './utils/auth';
import { ThemeProvider, createTheme, CssBaseline, Snackbar, Alert } from '@mui/material';

// Snackbar context and provider
const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };
  const handleClose = () => setSnackbar(s => ({ ...s, open: false }));

  useEffect(() => {
    const handler = (e) => {
      const { message, severity } = e.detail;
      showSnackbar(message, severity);
    };
    window.addEventListener('global-snackbar', handler);
    return () => window.removeEventListener('global-snackbar', handler);
  }, []);

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

SnackbarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  return isAuthenticated() ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const AuthRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
};

AuthRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  const [mode, setMode] = useState('light');
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#1976d2' : '#90caf9',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#fff' : '#1e1e1e',
      },
    },
  }), [mode]);

  const toggleMode = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <Router>
          <Navbar mode={mode} toggleMode={toggleMode} />
          <Routes>
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/forms/new" element={<PrivateRoute><FormBuilder /></PrivateRoute>} />
            <Route path="/forms/:formId/responses" element={<PrivateRoute><FormResponses /></PrivateRoute>} />
            <Route path="/forms/public/:formId" element={<PublicForm />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App; 