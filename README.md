# 🗳️ StealthVote: Anonymous Voting with Miden SDK

## 🚀 Hook: Why This Is Cool

Ever wanted to vote online without giving up your identity or relying on a centralized system? That’s exactly what **StealthVote** does. Built using the [Miden SDK](https://github.com/0xMiden/miden-sdk), this app lets you create private voting polls where only eligible users can cast a vote — but no one, not even the admin, can trace who voted or what they voted. That’s real privacy — and it works entirely in your browser.

Frankly saying , that was not even the initial idea.
Idea was to build an anonymous weight based voting system with escrow. weight vote because the vote power would be equal to your job position / role in company or how much money you lock in to by the power. helpful in some cases like DAOs or agencies. but I thought lets make this into step by step process to have better understanding, one step at a time. 

I have added the console to let the learner see what's happening behind the scene also when the interaction is happening or using any function of Miden SDK.


https://github.com/user-attachments/assets/95fa99d6-b996-4ee6-8e1c-45a7b2c77481


---

### P.S. Video demo of app interacting with Miden local node 0.10.0 attached at starting of stage 1 for reference.

## 🔧 Prerequisites

Before jumping in, make sure you have:

- Basic understanding of how blockchain and wallets work
- Node.js and npm installed
- Git installed
- [Local Miden Node](https://0xmiden.github.io/miden-docs/imported/miden-tutorials/src/miden_node_setup.html) (highly recommended)
- A modern browser (Chrome, Brave, Firefox)

---

## 📦 Project Overview

StealthVote is a privacy-preserving Yes/No voting system that runs entirely in the browser. It uses:

- **Miden SDK 0.9.4** for private note/account generation
- **Merkle trees** to prove voter eligibility
- **Simulated zero-knowledge logic** to validate votes without identity leaks

This project is a proof of concept to show how anonymous voting can work — even before full-blown smart contracts are available. The main challenge was simulating on-chain features using Miden’s client-side SDK, especially for note management and Merkle root generation.

➡️ **[Check out the code right here](./)**

---

## 📚 Key Concepts

### 1. Merkle Root for Eligibility
Instead of storing a voter list, we hash all voter notes and build a Merkle Tree. The Merkle Root is published as the “fingerprint” of all eligible voters. This lets voters prove inclusion without revealing their identity.

### 2. Private Account Notes
Each eligible voter receives a unique Miden account that serves as their "ballot". These notes are one-time use and unlinkable to their identity.

---

## 🧑‍🏫 Step-by-Step Tutorial  

### Click here to check demo of [Anonymous Voting Dapp Demo video](https://youtu.be/iDYPuabLJh8]) on youtube.

### 1. Clone the repo and install dependencies

```bash
git clone https://github.com/YOUR_USERNAME/stealthvote.git
cd stealthvote
npm install
```

> 💡 Pro tip: Spin up a local Miden node — the public one’s a bit moody.

---

### 2. Start your local Miden node

Follow the [official setup guide](https://0xmiden.github.io/miden-docs/imported/miden-tutorials/src/miden_node_setup.html) and run:

```bash
miden node run --dev
```

Keep this terminal open.

---

### 3. Launch the frontend

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser and you’re good to go.

---

### 4. Mint Voter Notes (Admin Side)

Go to the **Admin Panel** and click `> ISSUE VOTER NOTE`.

Behind the scenes:

```ts
const account = await client.newWallet(AccountStorageMode.private(), true);
const noteId = "note_" + Math.random().toString(36).substring(2, 10);
voterNotes.set(noteId, { id: noteId, hasVoted: false });
```

Each note is basically your private, one-time-use voting token.

Click `> GENERATE MERKLE ROOT` to finalize eligibility.

```ts
const allHashes = Array.from(voterNotes.keys()).sort().join("|");
const merkleRoot = simpleHash(allHashes);
```

---

### 5. Cast a Vote (Voter Side)

A voter enters their note ID and selects Yes/No. Then clicks `> CAST VOTE`.

```ts
const note = voterNotes.get(noteId);
if (note.hasVoted) throw new Error("Already voted");
note.hasVoted = true;
tally[choice]++;
```

Votes are counted, but no one knows who cast what. That’s the magic.

---

### 6. View Tally

Click `> VIEW TALLY` to see total votes.

> ✅ YES: 4  
> ❌ NO: 2  
> 📦 TOTAL: 6

---

## ⚠️ Common Pitfalls

### 1. SDK Errors on Public Testnet
Use a local node — public testnet often fails or hangs on `submitTransaction`.

### 2. Misusing Notes
Each note is **single-use**. Trying to reuse a note will throw an error — intentionally.

---

## 🔮 What’s Next: Stage 2

StealthVote Stage 2 will support:

### ✅ Weighted Voting with Escrow

Users can lock tokens as "vote weight" and cast a vote. Here's how it might look:

```ts
const voteWeight = 100_000n;
const script = generateVoteScript("YES", voteWeight);
const tx = await client.newScriptedTransactionRequest(
  user.id(), escrow.id(), script, voteWeight
);
await client.submitTransaction(await client.newTransaction(user.id(), tx));
```

### 🧠 MASM Pseudocode

```masm
# Vote Lock Script
push.VOTE_CHOICE
assert.eq "YES"
push.TOKENS_LOCKED
assert.ge 100_000
context::block_number
push.VOTING_END
assert.le
```

### 🔁 Refund or Burn After Vote

Depending on outcome, refund tokens to voter or send to burn address.

---

## 🛠️ SDK Feedback (200 words)

The Miden SDK makes local proving and wallet creation incredibly smooth, which is perfect for zero-knowledge dApps. However, a few pain points stand out:

- **No real contract scripting engine yet:** MASM is not fully supported in transaction flow, limiting full end-to-end workflows.
- **Merkle root operations must be done manually.** It would be great if the SDK had built-in support for Merkle tree construction and proof generation.
- **Note consumption simulation is awkward.** You have to track state manually, which leads to inconsistencies in prototypes.

### ✅ Suggested Improvement

> Add a `NoteManager` utility inside the SDK that can:
> - Track local note usage
> - Generate Merkle trees
> - Provide helper for creating proof-of-inclusion ZK circuits  
It’d save everyone from having to write glue code just to track note usage or Merkle trees.

> - The docs link to [Miden client - Typescript ](https://0xmiden.github.io/miden-docs/imported/miden-client/src/web-client/index.html) needs to be updated, it wasted a lot of time figuring out how things will work when half of the links were not working in the sub pages.
> - The major problem i faced was to understand or write using Miden Assembly, but as far as AI can help, there is posibility for making an ai tool to help make masm for the required idea we want, and the MASM playgfround is okay but a lot of learning curve for new dev.
> - Public rpc endpoint to testnot takes a lot of time to sync if we are not using cdn version , more documentation and utilisation guide for this can be helpful

It’d save everyone from having to write glue code just to track note usage or Merkle trees.

---

## ✅ Final Checklist

- [x] Issue private voter notes using Miden SDK
- [x] Generate and publish Merkle root for eligibility
- [x] Voters cast anonymous votes using note ID
- [x] Local tally updates in real time
- [x] Fully client-side, no backend required
- [ ] Stage 2 Pseudo code shared

---

**Privacy-first voting. Zero identity leaks. Built with Miden.**
