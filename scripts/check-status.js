const { ethers } = require('ethers');

// Configuration
const CONTRACT_ADDRESS = '0x21592f9C665d724ea65bCB91eC3AdD6cC68C74D1';
const RPC_URL = 'https://mainnet.base.org';

// Minimal ABI for status checking
const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "publicMintEnabled",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "result", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

async function checkMintingStatus() {
  try {
    console.log('🔗 Checking contract status...');
    console.log(`📄 Contract: ${CONTRACT_ADDRESS}`);

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    const [isEnabled, owner, supply] = await Promise.all([
      contract.publicMintEnabled(),
      contract.owner(),
      contract.totalSupply()
    ]);

    console.log('');
    console.log('📊 Current Status:');
    console.log(`👑 Contract Owner: ${owner}`);
    console.log(`📈 Total Supply: ${supply.toString()}/1000 NFTs`);
    console.log(`🚀 Minting Enabled: ${isEnabled ? '✅ YES' : '❌ NO'}`);

    if (!isEnabled) {
      console.log('');
      console.log('⚠️  Minting is currently DISABLED!');
      console.log('');
      console.log('To enable minting, run:');
      console.log('export OWNER_PRIVATE_KEY=your_private_key_here');
      console.log('pnpm enable-minting');
      console.log('');
      console.log('⚠️  WARNING: Never share your private key!');
    } else {
      console.log('');
      console.log('✅ Minting is ENABLED! Users can now mint NFTs.');
    }

  } catch (error) {
    console.error('❌ Error checking contract status:', error.message);
    process.exit(1);
  }
}

// Run the status check
checkMintingStatus();