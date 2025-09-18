import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import { logEvent } from '../middleware/logger';

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function UrlShortener({ onShorten }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [validity, setValidity] = useState('');
  const [shortcode, setShortcode] = useState('');
  const [error, setError] = useState('');

  const handleShorten = async () => {
    setError('');
    if (!isValidUrl(originalUrl)) {
      setError('Malformed URL. Please enter a valid URL.');
      logEvent('validation_error', { type: 'url', value: originalUrl });
      return;
    }
    if (validity && (!/^[0-9]+$/.test(validity) || parseInt(validity) <= 0)) {
      setError('Validity must be a positive integer (minutes).');
      logEvent('validation_error', { type: 'validity', value: validity });
      return;
    }
    if (shortcode && !/^[a-zA-Z0-9_-]{4,16}$/.test(shortcode)) {
      setError('Shortcode must be 4-16 alphanumeric characters, dashes or underscores.');
      logEvent('validation_error', { type: 'shortcode', value: shortcode });
      return;
    }
    // Simulate API call (replace with real API call in production)
    try {
      const now = new Date();
      const expiry = new Date(now.getTime() + 60000 * (validity ? parseInt(validity) : 30));
      const short = shortcode || Math.random().toString(36).substring(2, 8);
      const result = {
        originalUrl,
        short,
        createdAt: now.toISOString(),
        expiresAt: expiry.toISOString(),
        clickCount: 0,
        clicks: []
      };
      onShorten(result);
      logEvent('shorten_success', result);
      setOriginalUrl('');
      setValidity('');
      setShortcode('');
    } catch (e) {
      setError('Failed to shorten URL. Try again.');
      logEvent('shorten_error', { error: e.message });
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 4 }} elevation={3}>
      <Typography variant="h5" mb={2}>URL Shortener</Typography>
      <TextField
        label="Original URL"
        value={originalUrl}
        onChange={e => setOriginalUrl(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Validity (minutes)"
        value={validity}
        onChange={e => setValidity(e.target.value)}
        fullWidth
        margin="normal"
        placeholder="30 (default)"
      />
      <TextField
        label="Custom Shortcode (optional)"
        value={shortcode}
        onChange={e => setShortcode(e.target.value)}
        fullWidth
        margin="normal"
        placeholder="e.g. mylink123"
      />
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button variant="contained" onClick={handleShorten}>Shorten</Button>
      </Box>
    </Paper>
  );
}
