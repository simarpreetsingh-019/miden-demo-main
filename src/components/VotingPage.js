import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import ConsoleOutput from './ConsoleOutput';
import { WebClient } from '@demox-labs/miden-sdk';
import { useTransactions } from '../contexts/TransactionContext';
import { useNode } from '../contexts/NodeContext';
import { sha256 } from 'js-sha256'; // Import the hash function

// const MIDEN_NODE_URL = 'https://rpc.testnet.miden.io:443';

/**
 * Utility to build a Merkle proof for a given leaf index.
 * Returns an array of sibling hashes for the proof.
 */
function getMerkleProof(leaves, index) {
  let proof = [];
  let idx = index;
  let level = leaves.slice();
  while (level.length > 1) {
    const nextLevel = [];
    for (let i = 0; i < level.length; i += 2) {
      let left = level[i];
      let right = i + 1 < level.length ? level[i + 1] : left;
      nextLevel.push(sha256(left + right));
      if (i === idx || i + 1 === idx) {
        proof.push(i === idx ? right : left);
        idx = Math.floor(i / 2);
      }
    }
    level = nextLevel;
  }
  return proof;
}

/**
 * VotingPage - For users to submit their note and vote anonymously.
 * Generates Merkle proof and (scaffolded) ZK proof, shows CLI output.
 */
const VotingPage = () => {
  const [note, setNote] = useState('');
  const [vote, setVote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [consoleLines, setConsoleLines] = useState([]);
  const [merkleRoot, setMerkleRoot] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addTxHash } = useTransactions();
  const { nodeUrl } = useNode();

  // Load Merkle root and leaves from uploaded notes file
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        setLeaves(data.noteHashes || []);
        setMerkleRoot(data.merkleRoot || '');
        setConsoleLines((lines) => [
          ...lines,
          'Loaded Merkle root and note hashes from file.',
        ]);
      } catch {
        setConsoleLines((lines) => [...lines, 'Failed to parse notes file.']);
      }
    };
    reader.readAsText(file);
  };

  // Handler for submitting a vote
  const handleSubmit = async (e) => {
    e.preventDefault();
    setConsoleLines([]);
    setLoading(true);
    if (!note || !vote) {
      setConsoleLines(['Please enter your note and select Yes or No.']);
      setLoading(false);
      return;
    }
    if (!merkleRoot || leaves.length === 0) {
      setConsoleLines(['Please upload the notes file from the admin first.']);
      setLoading(false);
      return;
    }
    setConsoleLines((lines) => [...lines, 'Hashing note with SHA256...']);
    // Treat the note as the account ID string (official tutorial style)
    const noteHash = sha256(note);
    const index = leaves.indexOf(noteHash);
    if (index === -1) {
      setConsoleLines((lines) => [
        ...lines,
        'Note not found in Merkle leaves. Are you using the correct note?',
      ]);
      setLoading(false);
      return;
    }
    setConsoleLines((lines) => [
      ...lines,
      `Found note at index ${index}. Generating Merkle proof...`,
    ]);
    const proof = getMerkleProof(leaves, index);
    setConsoleLines((lines) => [
      ...lines,
      `Merkle proof: [${proof.join(', ')}]`,
    ]);

    try {
      setConsoleLines((lines) => [
        ...lines,
        `Connecting to Miden node (${nodeUrl})...`,
      ]);
      const client = await WebClient.createClient(nodeUrl);

      // In a real app, you would use the note to prove membership and consume it.
      // For demo, we simulate the ZK proof and note consumption.
      setConsoleLines((lines) => [
        ...lines,
        'Scaffolding ZK proof and note consumption (replace with real Miden SDK logic)...',
      ]);
      await new Promise((res) => setTimeout(res, 1200));
      // Simulate a transaction hash for demo
      const txHash = '0x' + Math.random().toString(16).slice(2, 10) + '...';
      addTxHash(txHash);
      setConsoleLines((lines) => [
        ...lines,
        `Vote (${vote.toUpperCase()}) submitted anonymously! (Demo)`,
      ]);
      setSubmitted(true);
    } catch (err) {
      setConsoleLines((lines) => [...lines, `Error: ${err.message}`]);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Anonymous Voting
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Enter your secret note and select your vote. Your vote will be counted
        anonymously using a Merkle proof and a zero-knowledge proof (Miden SDK).
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Button variant="outlined" component="label" sx={{ mb: 2 }}>
          Upload Notes File
          <input
            type="file"
            accept="application/json"
            hidden
            onChange={handleFileUpload}
          />
        </Button>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Your Secret Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            disabled={submitted || loading}
          />
          <RadioGroup
            row
            value={vote}
            onChange={(e) => setVote(e.target.value)}
            sx={{ mb: 2 }}
          >
            <FormControlLabel
              value="yes"
              control={<Radio />}
              label="Yes"
              disabled={submitted || loading}
            />
            <FormControlLabel
              value="no"
              control={<Radio />}
              label="No"
              disabled={submitted || loading}
            />
          </RadioGroup>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitted || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Vote'}
          </Button>
        </form>
      </Paper>
      <ConsoleOutput lines={consoleLines} />
      {submitted && (
        <Paper sx={{ p: 2, mt: 2, background: '#222', color: '#fff' }}>
          <Typography variant="h6">
            Thank you for voting anonymously!
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default VotingPage;
