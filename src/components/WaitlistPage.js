import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Alert,
} from '@mui/material';

/**
 * WaitlistPage - Users submit email and age to join the waitlist for a voting token.
 * If age > 18, allow submission. Waitlist is stored in localStorage for demo.
 */
const WaitlistPage = () => {
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Load waitlist from localStorage (for demo)
  const getWaitlist = () => {
    try {
      return JSON.parse(localStorage.getItem('waitlist') || '[]');
    } catch {
      return [];
    }
  };

  // Add user to waitlist in localStorage
  const addToWaitlist = (entry) => {
    const waitlist = getWaitlist();
    waitlist.push(entry);
    localStorage.setItem('waitlist', JSON.stringify(waitlist));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !age) {
      setError('Please enter your email and age.');
      return;
    }
    if (Number(age) < 18) {
      setError('You must be at least 18 years old to join the waitlist.');
      return;
    }
    // Add to waitlist
    addToWaitlist({ email, age: Number(age), timestamp: Date.now() });
    setSubmitted(true);
  };

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Join the Voting Waitlist
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Enter your email and age. If you are over 18, you can join the waitlist
        to receive a voting token (note).
      </Typography>
      <Paper sx={{ p: 3, mb: 2 }}>
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              required
              inputProps={{ min: 0 }}
            />
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Join Waitlist
            </Button>
          </form>
        ) : (
          <Alert severity="success">
            Thank you! You are on the waitlist for a voting token.
            <br />
            (For demo: your entry is stored locally and will be visible to the
            admin for approval.)
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default WaitlistPage;
