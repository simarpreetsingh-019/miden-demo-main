import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  CircularProgress,
} from '@mui/material';
import ConsoleOutput from './ConsoleOutput';
import { WebClient, AccountStorageMode, NoteType } from '@demox-labs/miden-sdk';
import { useTransactions } from '../contexts/TransactionContext';
import { useNode } from '../contexts/NodeContext';
import { sha256 } from 'js-sha256'; // Import the hash function

/**
 * Utility to build a Merkle tree and return the root and proofs.
 * For simplicity, this is a minimal implementation for demo/teaching.
 */
function buildMerkleTree(hashes) {
  let level = hashes.slice();
  const tree = [level];
  while (level.length > 1) {
    const nextLevel = [];
    for (let i = 0; i < level.length; i += 2) {
      if (i + 1 < level.length) {
        nextLevel.push(sha256(level[i] + level[i + 1]));
      } else {
        nextLevel.push(sha256(level[i] + level[i]));
      }
    }
    tree.unshift(nextLevel);
    level = nextLevel;
  }
  return { root: level[0], tree };
}

/**
 * AdminPage - For generating voting notes, note hashes, and Merkle root.
 * Only the admin can access this page.
 */
const AdminPage = ({ setMintedNotes, setMintedHashes }) => {
  const [numNotes, setNumNotes] = useState(5); // Default to 5 notes
  const [notes, setNotes] = useState([]);
  const [noteHashes, setNoteHashes] = useState([]);
  const [merkleRoot, setMerkleRoot] = useState('');
  const [consoleLines, setConsoleLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addTxHash } = useTransactions();
  const { nodeUrl } = useNode();

  // Handler for generating notes and Merkle root
  const handleGenerate = async () => {
    setLoading(true);
    setConsoleLines([]);
    setNotes([]);
    setNoteHashes([]);
    setMerkleRoot('');
    try {
      setConsoleLines((lines) => [
        ...lines,
        `Connecting to Miden node (${nodeUrl})...`,
      ]);
      const client = await WebClient.createClient(nodeUrl);
      setConsoleLines((lines) => [...lines, 'Ready!']);

      // Always create a new faucet for demo (no persistence)
      setConsoleLines((lines) => [
        ...lines,
        'Creating admin (faucet) account...',
      ]);
      const faucet = await client.newFaucet(
        AccountStorageMode.public(),
        false, // immutable
        'MID', // token symbol
        8, // decimals
        1000000n // max supply
      );
      setConsoleLines((lines) => [...lines, 'Faucet account created.']);
      await client.syncState();
      await new Promise((res) => setTimeout(res, 2000)); // wait 2 seconds

      setConsoleLines((lines) => [
        ...lines,
        `Minting ${numNotes} voting notes...`,
      ]);
      let newNotes = [];
      let hashes = [];
      for (let i = 0; i < numNotes; i++) {
        // 1. Create a new wallet for the voter
        const voter = await client.newWallet(AccountStorageMode.public(), true);
        // Use the account ID as the note string (official tutorial style)
        let noteString = voter.id().toString();
        await client.syncState();
        await new Promise((res) => setTimeout(res, 2000)); // wait 2 seconds

        // 2. Mint a note to the voter from the faucet
        const mintTxRequest = client.newMintTransactionRequest(
          voter.id(),
          faucet.id(),
          NoteType.Public,
          1n
        );
        const txResult = await client.newTransaction(
          faucet.id(),
          mintTxRequest
        );
        await client.submitTransaction(txResult);
        setConsoleLines((lines) => [
          ...lines,
          `Submitted mint transaction for voter ${
            i + 1
          }. Waiting for confirmation...`,
        ]);
        // Wait for block confirmation (tutorial: 10 seconds)
        await new Promise((res) => setTimeout(res, 10000));
        await client.syncState();
        // For demo, just log and continue
        newNotes.push(noteString);
        hashes.push(sha256(noteString));
        setConsoleLines((lines) => [
          ...lines,
          `Minted note for voter ${i + 1}`,
        ]);
      }

      setConsoleLines((lines) => [
        ...lines,
        'Building Merkle tree from note hashes...',
      ]);
      const { root } = buildMerkleTree(hashes);
      setConsoleLines((lines) => [...lines, `Merkle root: ${root}`]);
      setNotes(newNotes);
      setNoteHashes(hashes);
      setMerkleRoot(root);
      // Update the SideConsole with the latest notes/hashes
      if (setMintedNotes) setMintedNotes(newNotes);
      if (setMintedHashes) setMintedHashes(hashes);
    } catch (err) {
      setConsoleLines((lines) => [
        ...lines,
        `Error: ${err && (err.message || JSON.stringify(err))}`,
      ]);
      console.error('Full error:', err);
    }
    setLoading(false);
  };

  // Handler for downloading notes as JSON
  const handleDownload = () => {
    const data = JSON.stringify({ notes, noteHashes, merkleRoot }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voting_notes.json';
    a.click();
    URL.revokeObjectURL(url);
    setConsoleLines((lines) => [
      ...lines,
      'Downloaded notes as voting_notes.json.',
    ]);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin: Generate Voting Notes
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Uses the Miden SDK to mint voting notes and build a Merkle root.
        Download the notes and distribute them to voters.
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          label="Number of Notes"
          type="number"
          value={numNotes}
          onChange={(e) => setNumNotes(Number(e.target.value))}
          inputProps={{ min: 1, max: 100 }}
          sx={{ mr: 2, width: 160 }}
          disabled={loading}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerate}
          sx={{ mr: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Notes'}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDownload}
          disabled={notes.length === 0 || loading}
        >
          Download Notes
        </Button>
      </Paper>
      {merkleRoot && (
        <Paper sx={{ p: 2, mb: 2, background: '#222', color: '#fff' }}>
          <Typography variant="subtitle1">Merkle Root</Typography>
          <Box sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
            {merkleRoot}
          </Box>
        </Paper>
      )}
      <ConsoleOutput lines={consoleLines} />
      {notes.length > 0 && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="subtitle2">First {numNotes} Notes (for demo):</Typography>
          <ul style={{ fontFamily: 'monospace', fontSize: 14 }}>
            {notes.slice(0, 5).map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </Paper>
      )}
    </Box>
  );
};

export default AdminPage;
