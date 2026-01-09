# Votify - Decentralized Voting System

## 📋 Overview
Votify is a decentralized voting system built on the Ethereum blockchain (Sepolia testnet) that ensures transparent, secure, and tamper-proof voting.

## 🚀 Features
- **Transparent Voting**: All votes recorded on blockchain
- **Prevent Double-Voting**: Each address can only vote once
- **Owner Controls**: Only contract owner can add/edit candidates
- **Anyone Can Vote**: Open participation for all users
- **Real-time Results**: View live vote counts
- **MetaMask Integration**: Easy wallet connection

## 🛠️ Technology Stack
- **Frontend**: Next.js 14, React, TailwindCSS
- **Blockchain**: Solidity, Ethereum (Sepolia Testnet)
- **Web3**: Ethers.js v6
- **Wallet**: MetaMask

## 📝 Smart Contract Features
- Add/Update/Remove candidates (owner only)
- Cast votes (anyone, once per address)
- Toggle voting status (owner only)
- Prevent double-voting
- View all candidates and results
- Ownership transfer

## 🔧 Setup Instructions

### 1. Deploy Smart Contract on Remix

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file: `VotingSystem.sol`
3. Copy the contract code from `contracts/VotingSystem.sol`
4. Compile the contract (Solidity 0.8.x)
5. Deploy to Sepolia testnet:
   - Select "Injected Provider - MetaMask" environment
   - Make sure MetaMask is connected to Sepolia testnet
   - Click "Deploy"
   - Confirm the transaction in MetaMask
6. Copy the deployed contract address

### 2. Configure Environment Variables

1. Create `.env.local` in the project root (already created)
2. Add your contract address:
   ```
   NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=0xYourContractAddressHere
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the home page, then navigate to Votify.

## 📱 How to Use

### For Voters:
1. Connect your MetaMask wallet (Sepolia testnet)
2. Browse available candidates
3. Click "Vote" on your preferred candidate
4. Confirm the transaction
5. Your vote is recorded on the blockchain!

### For Contract Owner:
1. Connect with the owner wallet
2. Add candidates with name and description
3. Toggle voting status (open/close)
4. Manage candidates

## 🔐 Security Features
- Only owner can manage candidates
- One vote per address
- All transactions verified on blockchain
- Transparent vote counting
- Immutable voting records

## 🌐 Sepolia Testnet Setup

### Get Sepolia ETH:
1. Visit [Sepolia Faucet](https://sepoliafaucet.com/)
2. Or [Alchemy Faucet](https://sepoliafaucet.com/)
3. Request test ETH for transactions

### Add Sepolia to MetaMask:
- Network Name: Sepolia
- RPC URL: https://sepolia.infura.io/v3/YOUR-PROJECT-ID
- Chain ID: 11155111
- Currency Symbol: SepoliaETH
- Block Explorer: https://sepolia.etherscan.io/

## 📂 Project Structure
```
.
├── app/
│   ├── Votify/
│   │   └── page.js          # Voting interface
│   ├── page.js              # Home page
│   └── layout.js
├── contracts/
│   └── VotingSystem.sol     # Smart contract
├── .env.local               # Environment variables
└── README.md
```

## 🎯 Environment Variables Required

```bash
NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=  # Your deployed contract address on Sepolia
```

## 🔗 Useful Links
- [Remix IDE](https://remix.ethereum.org/)
- [Sepolia Etherscan](https://sepolia.etherscan.io/)
- [MetaMask](https://metamask.io/)
- [Sepolia Faucet](https://sepoliafaucet.com/)

## 📄 License
MIT

## 🤝 Contributing
Feel free to submit issues and enhancement requests!
