import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';

export default function StatisticsDashboard({ urls, onShortUrlClick }) {
  return (
    <Box sx={{ mt: 4, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" mb={2}>Statistics Dashboard</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Clicks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No URLs shortened yet.</TableCell>
              </TableRow>
            ) : (
              urls.map(row => (
                <TableRow key={row.short}>
                  <TableCell>
                    <Chip
                      label={window.location.origin + '/' + row.short}
                      color="primary"
                      clickable
                      onClick={() => onShortUrlClick(row.short)}
                    />
                  </TableCell>
                  <TableCell>{row.originalUrl}</TableCell>
                  <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{new Date(row.expiresAt).toLocaleString()}</TableCell>
                  <TableCell>{row.clickCount}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Click analytics per short link */}
      {urls.map(row => (
        row.clicks.length > 0 && (
          <Paper key={row.short} sx={{ mt: 3, p: 2 }}>
            <Typography variant="subtitle1">Clicks for {window.location.origin + '/' + row.short}</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {row.clicks.map((click, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{click.source || '-'}</TableCell>
                    <TableCell>{click.location || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )
      ))}
    </Box>
  );
}
