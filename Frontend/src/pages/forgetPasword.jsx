import React, { useState } from 'react';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Container,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { MailOutline } from '@mui/icons-material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('https://game-website-yyuo.onrender.com/api/auth/forgot-password', { email });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="mt-16">
      <Paper elevation={3} className="p-8 rounded-lg">
        <Box className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <MailOutline className="text-blue-500" fontSize="large" />
          </div>
          <Typography variant="h4" component="h2" className="text-center font-medium">
            Forgot Password
          </Typography>
          <Typography variant="body1" color="textSecondary" className="text-center mt-2">
            Enter your email address and we'll send you a link to reset your password
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="mb-4"
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            size="large"
            disabled={loading}
            className="py-3 mt-2"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>

        {message && (
          <Alert severity="success" className="mt-4">
            {message}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" className="mt-4">
            {error}
          </Alert>
        )}
        
        <Box className="mt-6 text-center">
          <Typography variant="body2" color="textSecondary">
            Remember your password?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Back to login
            </a>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
