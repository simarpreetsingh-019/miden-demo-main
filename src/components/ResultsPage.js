import React, { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import ConsoleOutput from './ConsoleOutput';

/**
 * ResultsPage - Shows the live Yes/No tally.
 * For demo, uses local state. In a real app, fetch from on-chain contract.
 */
const ResultsPage = () => {
  // Demo: Local state for tally. Replace with on-chain fetch in production.
  const [tally, setTally] = useState({ yes: 0, no: 0 });
  const [consoleLines, setConsoleLines] = useState([
    'This tally is local for demo purposes.',
    'In a real app, fetch the tally from the on-chain voting contract.',
  ]);

  // Demo: Simulate a vote being counted (for teaching/demo only)
  const simulateVote = (type) => {
    setTally((t) => ({ ...t, [type]: t[type] + 1 }));
    setConsoleLines((lines) => [
      ...lines,
      `Simulated a ${type.toUpperCase()} vote.`,
    ]);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Live Voting Results
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        This page shows the current Yes/No tally. In a real deployment, this
        would be fetched from the on-chain voting contract so everyone sees the
        same result.
      </Typography>
      <Paper sx={{ p: 2, mb: 2, background: '#222', color: '#fff' }}>
        <Typography variant="h6">Current Tally</Typography>
        <Box sx={{ fontFamily: 'monospace', fontSize: 20, mt: 1 }}>
          Yes: {tally.yes} <br />
          No: {tally.no}
        </Box>
      </Paper>
      <Button
        variant="outlined"
        color="success"
        onClick={() => simulateVote('yes')}
        sx={{ mr: 2 }}
      >
        Simulate Yes Vote
      </Button>
      <Button
        variant="outlined"
        color="error"
        onClick={() => simulateVote('no')}
      >
        Simulate No Vote
      </Button>
      <ConsoleOutput lines={consoleLines} />
    </Box>
  );
};

export default ResultsPage;
