import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Link as MuiLink,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import { useTransactions } from '../contexts/TransactionContext';

const MIDENSCAN_URL = 'https://testnet.midenscan.com/';

const SideConsole = ({ mintedNotes = [], mintedHashes = [] }) => {
  const { txHashes } = useTransactions();
  const [open, setOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);

  if (!open) return null;

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'fixed',
        top: 90,
        right: 24,
        width: minimized ? 80 : 360,
        maxHeight: minimized ? 60 : '70vh',
        overflowY: 'auto',
        background: 'rgba(24,24,32,0.98)',
        color: '#00FF00',
        fontFamily: 'JetBrains Mono, Fira Mono, monospace',
        zIndex: 1200,
        p: minimized ? 1 : 2,
        border: '2px solid #222',
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
        borderRadius: 3,
        display: { xs: 'none', md: 'block' },
        transition: 'width 0.2s, max-height 0.2s',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: minimized ? 0 : 1,
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: '#fff', mb: minimized ? 0 : 1, flexGrow: 1 }}
        >
          {minimized ? '...' : 'Recent Transactions & Notes'}
        </Typography>
        <Box>
          <Tooltip title={minimized ? 'Expand' : 'Minimize'}>
            <IconButton
              size="small"
              onClick={() => setMinimized((m) => !m)}
              sx={{ color: '#fff' }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close">
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              sx={{ color: '#fff' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {!minimized && (
        <>
          <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1 }}>
            Minted Notes
          </Typography>
          {mintedNotes.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
              No notes minted yet.
            </Typography>
          ) : (
            <Box sx={{ mb: 2 }}>
              {mintedNotes.map((note, i) => (
                <Box
                  key={i}
                  sx={{
                    fontSize: 13,
                    color: '#baffba',
                    wordBreak: 'break-all',
                    mb: 0.5,
                  }}
                >
                  Note: {note}
                  <br />
                  Hash: {mintedHashes[i]}
                </Box>
              ))}
            </Box>
          )}
          <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1 }}>
            Transactions
          </Typography>
        </>
      )}
      {!minimized && txHashes.length === 0 && (
        <Typography variant="body2" sx={{ color: '#888' }}>
          No transactions yet.
        </Typography>
      )}
      {!minimized &&
        txHashes.length > 0 &&
        txHashes.map((hash, i) => (
          <MuiLink
            key={hash}
            href={`${MIDENSCAN_URL}tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#00bcd4',
              fontSize: 14,
              display: 'block',
              mb: 0.5,
              wordBreak: 'break-all',
            }}
          >
            {hash}
          </MuiLink>
        ))}
    </Paper>
  );
};

export default SideConsole;
