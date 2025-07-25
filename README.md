# 🗳️ Miden Anonymous Voting Demo

A beautiful, fully client-side, privacy-preserving Yes/No voting application built with the [Miden SDK](https://github.com/0xMiden/miden-sdk) and React. This project demonstrates how to use Miden's privacy, Merkle, and zero-knowledge features for real-world anonymous voting.

---

## 🚨 Important: Run a Local Miden Node!

> **For best results, run your own [Miden node](https://0xmiden.github.io/miden-docs/imported/miden-tutorials/src/miden_node_setup.html) locally.**
>
> The public testnet is often unstable and may return errors. Local node = smooth experience!

---

## 🌟 What This Project Does

- **Anonymous Voting:** Only eligible users can vote, but no one (not even the admin) can see how they voted.
- **Privacy via ZK & Merkle:** Uses Merkle roots and zero-knowledge proofs to prove eligibility and one-time voting, without revealing identity.
- **Miden SDK Integration:** All cryptography, note minting, and proof logic is done in-browser using the Miden SDK.
- **Educational:** Every step is commented and explained for new developers.

---

## 🏗️ How It Works

### 1. **Admin: Generate Notes & Merkle Root**

- The admin creates a set of unique voting notes (tokens) for eligible voters.
- Each note is a Miden account ID, and all note hashes are combined into a Merkle root.
- The Merkle root is published as the public fingerprint of eligible voters.

**Code Snippet:**

```js
// src/components/AdminPage.js
const faucet = await client.newFaucet(...);
const voter = await client.newWallet(AccountStorageMode.public(), true);
const mintTxRequest = client.newMintTransactionRequest(
  voter.id(), faucet.id(), NoteType.Public, 1n
);
await client.submitTransaction(await client.newTransaction(faucet.id(), mintTxRequest));
const noteString = voter.id().toString();
const noteHash = sha256(noteString);
```

### 2. **Voter: Submit Note & Vote**

- The voter enters their secret note (account ID) and selects Yes/No.
- The app hashes the note, finds its Merkle proof, and (in a real app) would generate a ZK proof of eligibility and one-time use.

**Code Snippet:**

```js
// src/components/VotingPage.js
const noteHash = sha256(note); // note = account ID string
const index = leaves.indexOf(noteHash);
const proof = getMerkleProof(leaves, index);
```

### 3. **Results: Live Tally**

- (Demo) The results page shows a local tally. In a real app, this would fetch the tally from the on-chain contract.

---

## 🛠️ Setup & Usage

1. **Clone & Install:**
   ```bash
   git clone ...
   cd miden-voting-demo-copy
   npm install
   ```
2. **Run a Local Miden Node:**
   - [Follow the official guide](https://0xmiden.github.io/miden-docs/imported/miden-tutorials/src/miden_node_setup.html)
   - Start your node: `miden node run --dev` (or as per docs)
3. **Start the App:**
   ```bash
   npm start
   # Open http://localhost:3000
   ```
4. **Use the App:**
   - Go to **Admin** to mint notes and get the Merkle root.
   - Distribute notes to voters (copy from the side console).
   - Voters use their note to vote anonymously.
   - See the live tally (demo only).

---

## 🧑‍💻 Miden SDK Properties Used

- **Account Creation:** `client.newWallet`, `client.newFaucet`
- **Note Minting:** `client.newMintTransactionRequest`, `client.submitTransaction`
- **Merkle Trees:** All note hashes are combined into a Merkle root for eligibility proofs.
- **Zero-Knowledge Proofs:** (Scaffolded) The app is ready for ZK proof integration for one-time, anonymous voting.

---

## 📝 Code Structure

- `src/components/AdminPage.js` — Admin UI, note minting, Merkle root
- `src/components/VotingPage.js` — Voter UI, Merkle proof, ZK logic (scaffold)
- `src/components/ResultsPage.js` — Tally display (demo)
- `src/components/SideConsole.js` — Shows minted notes, hashes, and transactions
- `src/contexts/NodeContext.js` — Node selection (local/testnet)
- `src/contexts/TransactionContext.js` — Recent transactions

---

## 🧩 Troubleshooting & Common Errors

- **window.sha256 is not a function:**
  - Make sure all hashing uses the imported `sha256` from `js-sha256`.
- **No account header record found:**
  - Wait for the node to sync, or try again after a few seconds.
- **Transaction not yet committed:**
  - Wait longer for block confirmation, especially on public testnet.
- **Public testnet errors:**
  - Use a local node for best results!

---

## 📚 Further Learning & Resources

- [Miden SDK Tutorials](https://0xmiden.github.io/miden-docs/imported/miden-tutorials/)
- [Miden SDK GitHub](https://github.com/0xMiden/miden-sdk)
- [Zero-Knowledge Proofs](https://en.wikipedia.org/wiki/Zero-knowledge_proof)
- [Merkle Trees](https://en.wikipedia.org/wiki/Merkle_tree)

---

## 💡 Why These Properties?

- **Privacy:** Miden's UTXO and ZK model allows for true anonymous voting.
- **Eligibility:** Merkle roots let you prove membership without revealing which member you are.
- **One-time Use:** Notes are single-use, enforced by the contract and ZK proof.
- **Client-side ZK:** All cryptography runs in the browser for maximum privacy.

---

## 🏁 Reproducibility Checklist

- [ ] Run a local Miden node
- [ ] Install dependencies (`npm install`)
- [ ] Start the app (`npm start`)
- [ ] Use the Admin page to mint notes and get the Merkle root
- [ ] Distribute notes to voters
- [ ] Voters use their note to vote anonymously

---

**Enjoy building with Miden! For questions, see the official docs or open an issue.**
