# AI Agent NFT - FCFS Minting Platform

A professional, production-ready NFT minting platform built with Next.js, Solidity, and Web3 technologies. Mint unique AI-generated NFTs on Base Mainnet with First-Come-First-Serve (FCFS) minting.

## Overview

This is a complete, ready-to-deploy NFT ecosystem featuring:

- **Smart Contract**: ERC-721 contract with FCFS minting
- **Frontend**: Beautiful dark-themed interface with real-time minting status
- **Backend**: Secure API routes for metadata generation
- **Database**: Neon PostgreSQL for transaction tracking
- **IPFS Integration**: Pinata for decentralized NFT metadata storage
- **Web3 Integration**: Direct contract interaction for FCFS minting

---

## Quick Start (5 minutes)

### Prerequisites

- Node.js 18+ and pnpm installed
- Git
- A wallet with Base Mainnet access

### 1. Clone & Install

```bash
git clone https://github.com/rubynugraha/AgentNFT.git 
cd ai-agent-nft
pnpm install
```

### 2. Setup Environment Variables

```bash
# Copy the example file
cp .env.example .env.local
```

Fill in `.env.local` with your configuration (see [Environment Configuration](#environment-configuration) below).

### 3. Initialize Database

```bash
# The database tables will be created automatically on first API call
# Or manually run the setup script
node scripts/setup-db.js
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the landing page.

---

## Environment Configuration

### What is `.env.local`?

The `.env.local` file contains all configuration secrets and API keys needed for your application. **Never commit this file to version control.**

### How to Set Up Environment Variables

1. **Copy the example file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in each variable** with your actual values (see below)

3. **Restart your dev server** after making changes

### Required Environment Variables

| Variable | Description | Where to Get | Example |
|----------|-------------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | [Neon Console](https://console.neon.tech) | `postgresql://user:pass@...` |
| `NEXT_PUBLIC_RPC_URL` | Base Mainnet RPC endpoint | [BlockPI](https://base.blockpi.network) | `https://mainnet.base.org` |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Deployed ERC-721 contract address | Deploy contract first | `0x1234...` |
| `NEXT_PUBLIC_CHAIN_ID` | Base Mainnet chain ID (always 8453) | Fixed value | `8453` |
| `PINATA_API_KEY` | Pinata API key for IPFS | [Pinata Dashboard](https://app.pinata.cloud) | `your_key_here` |
| `PINATA_API_SECRET` | Pinata API secret | [Pinata Dashboard](https://app.pinata.cloud) | `your_secret_here` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_IPFS_GATEWAY` | IPFS gateway for viewing files | `https://gateway.pinata.cloud` |

| `NEXT_PUBLIC_APP_URL` | Application base URL | `http://localhost:3000` |
| `NODE_ENV` | Environment mode | `development` |

---

## Setup Instructions (Detailed)

### Step 1: Database Setup (Neon PostgreSQL)

1. **Create Neon Account**:
   - Go to [console.neon.tech](https://console.neon.tech)
   - Sign up with GitHub or email
   - Create a new project

2. **Get Connection String**:
   - In Neon Console, go to "Connection strings"
   - Copy the "Connection string" (looks like: `postgresql://user:password@host/database?sslmode=require`)
   - Paste it into `.env.local` as `DATABASE_URL`

3. **Verify Connection**:
   ```bash
   # The connection will be tested automatically on first API call
   # Or test manually: node scripts/setup-db.js
   ```

### Step 2: Get API Keys

#### Pinata (IPFS Storage)
1. Visit [app.pinata.cloud](https://app.pinata.cloud)
2. Sign up (free tier is sufficient)
3. Click "API Keys" → "New Key"
4. Copy `API Key` and `API Secret`
5. Add to `.env.local`:
   ```
   PINATA_API_KEY=your_api_key
   PINATA_API_SECRET=your_api_secret
   ```

#### Fal.ai (Image Generation)
1. Visit [www.fal.ai](https://www.fal.ai)
2. Sign up (free tier includes image generation credits)
3. Go to [Settings → API Keys](https://www.fal.ai/dashboard/settings)
4. Create a new API key
5. Add to `.env.local`:
   ```
   FAL_API_KEY=your_fal_api_key
   ```

#### Base RPC URL
Use a public RPC endpoint (free):
```
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org
```

Or use BlockPI for better reliability:
```
NEXT_PUBLIC_RPC_URL=https://base.blockpi.network/v1/rpc/public
```

### Step 3: Deploy Smart Contract

The smart contract must be deployed to Base Mainnet before your app can function.

#### Using Remix IDE (Easiest)

1. **Prepare Contract**:
   - Go to [remix.ethereum.org](https://remix.ethereum.org)
   - Create new file: `AIAgentNFT.sol`
   - Copy code from `/contracts/AIAgentNFT.sol`

2. **Configure Compiler**:
   - Left sidebar → "Solidity Compiler"
   - Select version: `0.8.19`
   - Click "Compile AIAgentNFT.sol"

3. **Deploy to Base Mainnet**:
   - Left sidebar → "Deploy & Run Transactions"
   - Change environment to "Injected Provider" (MetaMask)
   - Make sure MetaMask is set to Base Mainnet
   - Make sure you have funds (0.00025 ETH minimum for deployment + gas)
   - Click "Deploy"
   - Sign transaction in MetaMask
   - Wait for confirmation

4. **Save Contract Address**:
   - Copy deployed contract address
   - Add to `.env.local`:
     ```
     NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890abcdef...
     ```

#### Contract Constructor Parameters

If Remix asks for constructor parameters:
- **Treasury Address**: Your wallet address for receiving royalties (0x...)
- **Base CID**: Your IPFS base CID for metadata (update after uploading)

### Step 4: Restart & Test

```bash
# Stop dev server (Ctrl+C)
# Restart
pnpm dev

# Visit http://localhost:3000
# You should see the landing page without setup warnings
```

---

## Features Overview

### For End Users

#### Landing Page (`/`)
- Beautiful hero section with call-to-action
- Feature showcase (AI generation, IPFS storage, Base Mainnet)
- How-it-works guide (3 easy steps for FCFS)
- Collection statistics (supply, pricing, minting status)

#### Minting Page (`/mint`)
- Connect wallet with WalletConnect/MetaMask
- Real-time minting statistics
- FCFS minting button with transaction status
- Connected wallet display
- Gas estimation
- Rarity tier information

---

## Technical Architecture

### Frontend Stack
- **Next.js 16** - React framework with SSR
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling with custom animations
- **Wagmi + Viem** - Web3 wallet integration
- **Web3Modal** - Wallet connection UI
- **React Hook Form** - Form state management

### Backend Stack
- **Next.js API Routes** - Serverless functions
- **Neon PostgreSQL** - Database
- **Pinata API** - IPFS storage
- **Fal.ai API** - AI image generation
- **Ethers.js** - Smart contract interaction

### Smart Contract
- **ERC-721** - NFT standard with ERC-2981 royalties
- **Solidity 0.8.19** - Contract language
- **Base Mainnet** - Deployment chain
- **FCFS Minting** - First-Come-First-Serve mechanism
- **Anti-Bot Protection** - Rate limiting and one-per-wallet enforcement

### Database Schema
```
mint_records
├── id (UUID)
├── wallet_address (VARCHAR)
├── token_id (BIGINT)
├── transaction_hash (VARCHAR)
├── mint_price (DECIMAL)
└── minted_at (TIMESTAMP)

nft_metadata
├── token_id (BIGINT)
├── ipfs_hash (VARCHAR)
├── image_url (VARCHAR)
├── attributes (JSON)
└── created_at (TIMESTAMP)
```

---

## Contract Configuration

### Supply & Pricing
- **Total Supply**: 1,000 NFTs
- **Mint Price**: 0.00025 ETH
- **Max per Wallet**: 1 NFT (enforced by contract)
- **Anti-Bot Delay**: 60 seconds between mints

### Key Features
- **FCFS Minting**: First-Come-First-Serve based on transaction confirmation
- **ERC-2981 Royalties**: Automatic royalty payments on secondary sales
- **Provenance Hash**: Authenticity verification for the collection
- **Reveal Mechanism**: Two-phase reveal for fair rarity distribution

### Enabling Minting

By default, the smart contract deploys with public minting **disabled**. You must enable it before users can mint NFTs.

#### Check Current Status

First, check if minting is enabled:
```bash
pnpm check-status
```

This will show:
- Contract owner address
- Current total supply
- Whether minting is enabled or disabled

#### Using the Enable Script

1. **Set your private key** (the contract owner's private key):
   ```bash
   export OWNER_PRIVATE_KEY=your_private_key_here
   ```

2. **Run the enable script**:
   ```bash
   pnpm enable-minting
   # or
   npm run enable-minting
   ```

3. **Verify**: The script will show the transaction hash and confirm minting is enabled.

#### Manual Method (Advanced)

If you prefer to enable minting manually:

1. Connect to Base Mainnet with the contract owner's wallet
2. Call the `togglePublicMint(true)` function on the contract
3. Verify with `publicMintEnabled()` - should return `true`

⚠️ **Security Warning**: Never share your private key or commit it to version control!

---

## API Endpoints

### Public Endpoints

#### GET `/api/metadata?tokenId=1`
Get metadata for a specific token ID from IPFS  
Returns IPFS hash, image URL, and attributes

---

## Troubleshooting

### Common Errors

#### "Contract data could not be loaded. Please check the address or network."
- **Cause**: The DApp cannot reach a valid contract on the configured RPC endpoint.  
  Possible reasons:
  1. `NEXT_PUBLIC_CONTRACT_ADDRESS` is not set or incorrect.
  2. The RPC URL (`NEXT_PUBLIC_RPC_URL`) is wrong or the network is not Base Mainnet.
  3. The contract has not been deployed yet.
  4. **ABI mismatch** – the address points to a different contract than the one your frontend
     expects (for example you copied the wrong address or deployed a different code).
     In development the console will log a message like
     `ABI probe failed – contract may not implement expected interface: …` or show
     a revert when calling `MAX_SUPPLY()`.
- **Solution**:
  1. Verify `.env.local` contains the correct address and RPC URL.
  2. Ensure your wallet is connected to Base Mainnet.
  3. Deploy the contract or update the address.
  4. If you see an ABI probe error in the console, double‑check that the address
     matches the contract you deployed (or redeploy using the correct source).
  5. When the error appears on the mint page you will now see the configured contract address and the RPC chainId – use those values to help spot typos or wrong network settings.

**Cause**: Missing environment variables
**Solution**: 
1. Copy `.env.example` to `.env.local`
2. Fill in all required variables
3. Restart dev server

### Database Connection Error

**Error**: `getaddrinfo ENOTFOUND`
**Solution**:
1. Check `DATABASE_URL` is correct
2. Verify Neon project is running
3. Check firewall/VPN isn't blocking
4. Try connecting with psql: `psql $DATABASE_URL`

### Contract Not Found (0x0000...)

**Error**: "Contract address not set"
**Solution**:
1. Deploy contract to Base Mainnet
2. Copy contract address
3. Add to `.env.local` as `NEXT_PUBLIC_CONTRACT_ADDRESS`
4. Restart dev server

### Image Generation Fails

**Error**: "FAL_API_KEY not provided"
**Solution**:
1. Get API key from [fal.ai](https://www.fal.ai)
2. Add to `.env.local`
3. Verify key is valid
4. Check you have remaining credits

### IPFS Upload Fails

**Error**: "Pinata authentication failed"
**Solution**:
1. Verify `PINATA_API_KEY` and `PINATA_API_SECRET`
2. Check keys are not expired in Pinata dashboard
3. Verify account has storage quota
4. Try creating new API key in Pinata

### Wallet Connection Fails

**Error**: "User rejected wallet selection"
**Solution**:
1. Ensure MetaMask/WalletConnect installed
2. Make sure you're on Base Mainnet
3. Try connecting to different wallet
4. Clear browser cache and try again

---

## Deployment Guide

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial NFT app"
   git push origin main
   ```

2. **Create Vercel Project**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Import"

3. **Add Environment Variables**:
   - Go to "Settings" → "Environment Variables"
   - Add all variables from `.env.local`
   - Click "Save"

4. **Deploy**:
   - Vercel auto-deploys on push
   - Production URL: `https://your-project.vercel.app`

### Deploy Smart Contract to Base Mainnet

1. **Get Funds**:
   - Need 0.00025+ ETH on Base Mainnet
   - Bridge ETH from Ethereum Mainnet using [Base Bridge](https://bridge.base.org)

2. **Deploy via Remix**:
   - Follow "Deploy Smart Contract" section above
   - Make sure network is set to Base Mainnet
   - Sign transaction in wallet

3. **Verify Contract** (Optional):
   - Go to [Base Scan](https://basescan.org)
   - Search your contract address
   - Click "Verify and Publish"
   - Helps with transparency

---

## Project Structure

```
ai-agent-nft/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles & animations
│   ├── mint/
│   │   └── page.tsx          # Minting page
│   └── api/
│       └── metadata/         # Get NFT metadata
├── components/
│   ├── countdown-timer.tsx     # Animated countdown
│   ├── feature-grid.tsx        # Feature showcase
│   ├── minting-interface.tsx   # FCFS minting UI
│   └── collection-showcase.tsx # NFT preview
├── lib/
│   ├── db.ts                   # Database functions
│   ├── web3.ts                 # Web3 utilities
│   ├── ipfs.ts                 # Pinata integration
│   └── utils.ts                # Helper utilities
├── contracts/
│   └── AIAgentNFT.sol          # ERC-721 contract
├── public/
│   └── sample-metadata.json    # Sample NFT metadata
├── scripts/
│   └── setup-db.js             # Database initialization
├── .env.example                # Environment template
└── package.json                # Dependencies
```

---

## Smart Contract Features

### FCFS Mechanism
- **First-Come-First-Serve**: NFTs are minted in the order transactions are confirmed
- **One per Wallet**: Each wallet can mint only 1 NFT (enforced by contract)
- **Fair Distribution**: Random rarity assignment prevents MEV/front-running advantages

### Anti-Bot Protection
- **Mint Delay**: Configurable delay between mints (default: 60 seconds)
- **Wallet Limit**: Hard-coded one mint per wallet lifetime
- **Block Height Checks**: Prevents batch minting in same block
- **Provenance Hash**: Ensures authenticity and prevents duplication

### Advanced Features
- **ERC-2981 Royalties**: Automatic royalty payment on secondary sales
- **IPFS Integration**: Final metadata stored on decentralized IPFS
- **Reveal Mechanism**: Two-phase reveal for rarity distribution
- **Immutable Provenance**: Hash-based authenticity verification

### Contract Constants
| Parameter | Value | Purpose |
|-----------|-------|---------|
| `MAX_SUPPLY` | 1,000 | Total NFTs available |
| `MINT_PRICE` | 0.00025 ETH | Price per mint |
| `ANTI_BOT_DELAY` | 60 secs | Min time between sequential mints |
| `Chain` | Base Mainnet | Deployment network |

---

## Web3 Utilities

Located in `lib/web3.ts`, comprehensive utilities for contract interaction:

### Key Functions
- `getContractInfo()` - Fetch price, supply, and mint status
- `canUserMint()` - Check if user can mint (includes anti-bot check)
- `hasUserMinted()` - Verify one-per-wallet limit
- `getRevealStatus()` - Check reveal phase
- `getRoyaltyInfo()` - Get secondary sale royalty amounts
- `getTreasuryAddress()` - Fetch treasury wallet

See [lib/CONTRACT_API.md](lib/CONTRACT_API.md) for complete API reference.

---

## Minting Process (FCFS)

The First-Come-First-Serve (FCFS) minting process works as follows:

1. **Connect Wallet**: User connects their Web3 wallet via MetaMask or WalletConnect
2. **Check Availability**: View real-time minting stats and available NFTs
3. **Submit Transaction**: Click "Mint Now" to submit a transaction
4. **Confirm on Blockchain**: Transaction is confirmed on Base Mainnet
5. **Receive NFT**: NFT is minted and immediately transferred to the user's wallet

Each transaction mints 1 NFT with a random rarity tier:
- **Common**: 50% probability
- **Rare**: 30% probability
- **Ultra Rare**: 12% probability
- **Epic**: 7% probability
- **Legendary**: 1% probability

---

## Security Notes

- **Private Keys**: Never commit `.env.local` or expose private keys
- **Contract Audit**: Have contract audited before mainnet deployment
- **IPFS Security**: Upload metadata after contract is finalized
- **Database**: Regular backups of Neon PostgreSQL recommended
- **Rate Limiting**: Implement rate limiting on API routes in production

---

## License

This project is provided as-is for educational and commercial use.

---

## Support

For issues and questions:
1. Check the Troubleshooting section above
2. Review the configuration guide
3. Check contract logs in BaseScan
4. Review API response in browser console

---

## Changelog

### Version 2.0 (Current)
- Complete ERC-721 contract with FCFS minting
- Full-featured minting website with anti-bot protection
- ERC-2981 royalty support for secondary sales
- IPFS integration for metadata storage
- One-per-wallet enforcement
- 1,000 total supply with rarity tiers
- 0.00025 ETH fixed pricing
- Provenance hash for authenticity

### Version 1.0 (Legacy)
- Initial whitelist-based minting system
- Admin approval workflow
- Multi-tier pricing model
