import { ethers } from 'ethers';

// Base Mainnet RPC URL (can be overridden via env)
export const BASE_RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.base.org';

// Alternative RPC URLs for Base mainnet (include custom URL first)
const BASE_RPC_URLS = [
  BASE_RPC_URL,
  'https://mainnet.base.org',
  'https://base.llamarpc.com',
  'https://base-mainnet.publicnode.com',
  'https://base.publicnode.com'
];

// Contract ABI for NFT minting (from deployed smart contract)
const NFT_ABI = [{"inputs":[{"internalType":"address","name":"_treasury","type":"address"},{"internalType":"string","name":"_baseCID","type":"string"},{"internalType":"bytes32","name":"_provenanceHash","type":"bytes32"},{"internalType":"uint96","name":"royaltyFee","type":"uint96"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ApprovalCallerNotOwnerNorApproved","type":"error"},{"inputs":[],"name":"ApprovalQueryForNonexistentToken","type":"error"},{"inputs":[],"name":"BalanceQueryForZeroAddress","type":"error"},{"inputs":[{"internalType":"uint256","name":"numerator","type":"uint256"},{"internalType":"uint256","name":"denominator","type":"uint256"}],"name":"ERC2981InvalidDefaultRoyalty","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC2981InvalidDefaultRoyaltyReceiver","type":"error"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"numerator","type":"uint256"},{"internalType":"uint256","name":"denominator","type":"uint256"}],"name":"ERC2981InvalidTokenRoyalty","type":"error"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC2981InvalidTokenRoyaltyReceiver","type":"error"},{"inputs":[],"name":"MintERC2309QuantityExceedsLimit","type":"error"},{"inputs":[],"name":"MintToZeroAddress","type":"error"},{"inputs":[],"name":"MintZeroQuantity","type":"error"},{"inputs":[],"name":"NotCompatibleWithSpotMints","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"inputs":[],"name":"OwnerQueryForNonexistentToken","type":"error"},{"inputs":[],"name":"OwnershipNotInitializedForExtraData","type":"error"},{"inputs":[],"name":"SequentialMintExceedsLimit","type":"error"},{"inputs":[],"name":"SequentialUpToTooSmall","type":"error"},{"inputs":[],"name":"SpotMintTokenIdTooSmall","type":"error"},{"inputs":[],"name":"TokenAlreadyExists","type":"error"},{"inputs":[],"name":"TransferCallerNotOwnerNorApproved","type":"error"},{"inputs":[],"name":"TransferFromIncorrectOwner","type":"error"},{"inputs":[],"name":"TransferToNonERC721ReceiverImplementer","type":"error"},{"inputs":[],"name":"TransferToZeroAddress","type":"error"},{"inputs":[],"name":"URIQueryForNonexistentToken","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"fromTokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"toTokenId","type":"uint256"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"ConsecutiveTransfer","type":"event"},{"anonymous":false,"inputs":[],"name":"MintClosedForever","type":"event"},{"anonymous":false,"inputs":[],"name":"OwnershipRenouncedFinal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"status","type":"bool"}],"name":"PublicMintToggled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"offset","type":"uint256"}],"name":"RevealFinalized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"RevealStarted","type":"event"},{"anonymous":false,"inputs":[],"name":"RoyaltyFrozen","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint96","name":"fee","type":"uint96"}],"name":"RoyaltyUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"WithdrawExecuted","type":"event"},{"inputs":[],"name":"ANTI_BOT_DELAY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"BASE_CID_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINT_PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PROVENANCE_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"closeMintForever","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"finalizeReveal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"freezeRoyalty","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastMintTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"mintPermanentlyClosed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"minted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"publicMintEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnershipFinal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"revealBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"revealOffset","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"revealed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"royaltyFrozen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"salePrice","type":"uint256"}],"name":"royaltyInfo","outputs":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint96","name":"fee","type":"uint96"}],"name":"setRoyalty","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startReveal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"status","type":"bool"}],"name":"togglePublicMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"result","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"treasury","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

// Contract Address
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x66f523963454463fCD1Dca0f25C80D554313a41f';

// Get contract instance for reading (no signer needed)
export function getContractInstance(contractAddress: string) {
  // Try multiple RPC URLs in case one fails
  for (const rpcUrl of BASE_RPC_URLS) {
    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const contract = new ethers.Contract(contractAddress, NFT_ABI, provider);
      return contract;
    } catch (error) {
      console.warn(`Failed to connect to ${rpcUrl}, trying next...`);
      continue;
    }
  }
  // Fallback to primary RPC if all others fail
  const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
  return new ethers.Contract(contractAddress, NFT_ABI, provider);
}

// Get contract instance with signer for writing
export async function getContractWithSigner(contractAddress: string, signer: ethers.Signer) {
  return new ethers.Contract(contractAddress, NFT_ABI, signer);
}

// Get provider for Base Mainnet
export function getProvider() {
  return new ethers.JsonRpcProvider(BASE_RPC_URL);
}

// Format ether to wei
export function etherToWei(amount: string): bigint {
  return ethers.parseEther(amount);
}

// Format wei to ether
export function weiToEther(amount: bigint): string {
  return ethers.formatEther(amount);
}

// Validate wallet address
export function isValidAddress(address: string): boolean {
  return ethers.isAddress(address);
}

// Format address for display
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Debug helper to diagnose contract and network issues
export async function diagnoseContractIssue(contractAddress: string) {
  const provider = getProvider();
  const diagnostics = {
    addressValid: false,
    contractExistsOnNetwork: false,
    networkInfo: null as any,
    rpcHealth: false,
    suggestions: [] as string[],
  };

  try {
    // Check address format
    diagnostics.addressValid = ethers.isAddress(contractAddress);
    if (!diagnostics.addressValid) {
      diagnostics.suggestions.push(`❌ Contract address "${contractAddress}" is not a valid Ethereum address`);
      return diagnostics;
    }

    // Check network
    try {
      const network = await provider.getNetwork();
      diagnostics.networkInfo = {
        name: network.name,
        chainId: network.chainId,
      };
      diagnostics.rpcHealth = true;

      if (Number(network.chainId) !== 8453) {
        diagnostics.suggestions.push(
          `❌ RPC is on chain ${network.chainId}, but Base Mainnet is 8453. ` +
          `Update NEXT_PUBLIC_RPC_URL to https://mainnet.base.org`
        );
      }
    } catch (e) {
      diagnostics.suggestions.push(`❌ Cannot connect to RPC endpoint. Check NEXT_PUBLIC_RPC_URL`);
      return diagnostics;
    }

    // Check if contract exists
    const code = await provider.getCode(contractAddress);
    diagnostics.contractExistsOnNetwork = code !== '0x' && code !== '';

    if (!diagnostics.contractExistsOnNetwork) {
      diagnostics.suggestions.push(
        `❌ No contract found at ${contractAddress.substring(0, 10)}... on Base Mainnet. ` +
        `Either the address is incorrect or the contract hasn't been deployed yet.`
      );
    }

    return diagnostics;
  } catch (error: any) {
    diagnostics.suggestions.push(`⚠️  Diagnostic check failed: ${error?.message || error}`);
    return diagnostics;
  }
}

// Get contract info from blockchain (price, supply, status)
export async function getContractInfo(contractAddress: string) {
  const provider = getProvider();
  try {
    // Validate contract address format
    if (!contractAddress || !ethers.isAddress(contractAddress)) {
      throw new Error(`Invalid contract address: ${contractAddress}`);
    }

    // Validate network and RPC endpoint
    try {
      const network = await provider.getNetwork();
      const expected = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 8453); // 8453 is Base Mainnet
      const netNum =
        typeof network.chainId === 'number'
          ? network.chainId
          : Number(network.chainId);
      if (expected && netNum !== expected) {
        console.warn(
          `⚠️  Network mismatch: Provider is on chain ${netNum}, expected chain ${expected}. ` +
          `Make sure NEXT_PUBLIC_RPC_URL points to Base Mainnet (https://mainnet.base.org)`
        );
      }
    } catch (netErr) {
      console.debug('Unable to verify network from provider:', netErr);
    }

    // Check if contract code exists at the address
    const code = await provider.getCode(contractAddress);
    if (!code || code === '0x') {
      throw new Error(
        `No contract deployed at ${contractAddress} on the current network. ` +
        `Verify that the contract address is correct and deployed on Base Mainnet.`
      );
    }

    const contract = getContractInstance(contractAddress);

    // Fetch contract info with individual error handling for each call
    let mintPrice = '0';
    let maxSupply = 0;
    let totalSupply = 0;
    let publicEnabled = false;

    try {
      mintPrice = weiToEther(await contract.MINT_PRICE());
    } catch (err: any) {
      console.warn('Error fetching MINT_PRICE:', err?.message || err);
      mintPrice = '0.01'; // Default fallback
    }

    try {
      maxSupply = Number(await contract.MAX_SUPPLY());
    } catch (err: any) {
      console.warn('Error fetching MAX_SUPPLY:', err?.message || err);
      maxSupply = 1000; // Default fallback
    }

    try {
      totalSupply = Number(await contract.totalSupply());
    } catch (err: any) {
      console.warn('Error fetching totalSupply:', err?.message || err);
      totalSupply = 0; // Default fallback
    }

    try {
      publicEnabled = Boolean(await contract.publicMintEnabled());
    } catch (err: any) {
      console.warn('Error fetching publicMintEnabled:', err?.message || err);
      publicEnabled = true; // Default fallback
    }

    return {
      mintPrice,
      maxSupply,
      totalSupply,
      publicMintEnabled: publicEnabled,
    };
  } catch (error: any) {
    console.error('Error fetching contract info:', error?.message || error);
    // Return fallback values if contract calls fail
    return {
      mintPrice: '0.01',
      maxSupply: 1000,
      totalSupply: 0,
      publicMintEnabled: true,
    };
  }
}

// Check if user has sufficient balance for minting
export async function checkWalletBalance(
  walletAddress: string,
  contractAddress: string,
  signer: ethers.Signer
): Promise<{
  hasEnoughBalance: boolean;
  balance: string;
  requiredAmount: string;
  gasEstimate: string;
}> {
  try {
    const provider = signer.provider as ethers.Provider;
    const contract = await getContractWithSigner(contractAddress, signer);

    // Get wallet balance
    const balance = await provider.getBalance(walletAddress);
    const balanceEther = ethers.formatEther(balance);

    // Get mint price
    const mintPrice = await contract.MINT_PRICE();
    const mintPriceEther = ethers.formatEther(mintPrice);

    // Estimate gas
    let gasEstimate;
    try {
      gasEstimate = await contract.mint.estimateGas({ value: mintPrice });
      gasEstimate = (gasEstimate * 120n) / 100n; // 20% buffer
    } catch {
      gasEstimate = 200000n;
    }

    // Get gas price
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || ethers.parseUnits('20', 'gwei');
    const gasCost = gasEstimate * gasPrice;
    const gasCostEther = ethers.formatEther(gasCost);

    // Total required
    const totalRequired = mintPrice + gasCost;
    const totalRequiredEther = ethers.formatEther(totalRequired);

    const hasEnoughBalance = balance >= totalRequired;

    return {
      hasEnoughBalance,
      balance: balanceEther,
      requiredAmount: totalRequiredEther,
      gasEstimate: gasCostEther,
    };
  } catch (error) {
    console.error('Error checking wallet balance:', error);
    return {
      hasEnoughBalance: false,
      balance: '0',
      requiredAmount: '0',
      gasEstimate: '0',
    };
  }
}

// Check if user has already minted
export async function hasUserMinted(contractAddress: string, walletAddress: string): Promise<boolean> {
  try {
    const contract = getContractInstance(contractAddress);
    const hasMinted = await contract.minted(walletAddress);
    return Boolean(hasMinted);
  } catch (error) {
    console.debug('Error checking if user minted:', error);
    return false;
  }
}

// Get user's last mint timestamp
export async function getLastMintTimestamp(contractAddress: string, walletAddress: string): Promise<number> {
  try {
    const contract = getContractInstance(contractAddress);
    const timestamp = await contract.lastMintTimestamp(walletAddress);
    return Number(timestamp);
  } catch (error) {
    console.debug('Error getting last mint timestamp:', error);
    return 0;
  }
}

// Read anti-bot delay constant from contract (zero when not used)
export async function getAntiBotDelay(contractAddress: string): Promise<number> {
  try {
    const contract = getContractInstance(contractAddress);
    const delay = await contract.ANTI_BOT_DELAY();
    return Number(delay);
  } catch (error) {
    console.debug('Error fetching anti-bot delay:', error);
    return 0;
  }
}

// Check if user can mint (handles anti-bot delay)
export async function canUserMint(contractAddress: string, walletAddress: string): Promise<{ canMint: boolean; reason?: string }> {
  try {
    const [hasMinted, lastTimestamp, delay] = await Promise.all([
      hasUserMinted(contractAddress, walletAddress),
      getLastMintTimestamp(contractAddress, walletAddress),
      getAntiBotDelay(contractAddress),
    ]);

    // One mint per wallet
    if (hasMinted) {
      return { canMint: false, reason: 'You have already minted an NFT' };
    }

    // Check anti-bot delay if they have minted before
    if (lastTimestamp > 0 && delay > 0) {
      const now = Math.floor(Date.now() / 1000);
      const timeSinceMint = now - lastTimestamp;
      if (timeSinceMint < delay) {
        const waitTime = delay - timeSinceMint;
        return { canMint: false, reason: `Please wait ${waitTime} seconds before minting again` };
      }
    }

    return { canMint: true };
  } catch (error) {
    console.debug('Error checking if user can mint:', error);
    return { canMint: true }; // Allow attempt even if check fails
  }
}

// Get reveal status
export async function getRevealStatus(contractAddress: string): Promise<{ revealed: boolean; revealBlock: number; revealOffset: number }> {
  try {
    const contract = getContractInstance(contractAddress);
    const [revealed, revealBlock, revealOffset] = await Promise.all([
      contract.revealed(),
      contract.revealBlock(),
      contract.revealOffset(),
    ]);
    return {
      revealed: Boolean(revealed),
      revealBlock: Number(revealBlock),
      revealOffset: Number(revealOffset),
    };
  } catch (error) {
    console.debug('Error getting reveal status:', error);
    return { revealed: false, revealBlock: 0, revealOffset: 0 };
  }
}

// Get royalty info
export async function getRoyaltyInfo(
  contractAddress: string,
  tokenId: number,
  salePrice: bigint
): Promise<{ receiver: string; royaltyAmount: string }> {
  try {
    const contract = getContractInstance(contractAddress);
    const [receiver, royaltyAmount] = await contract.royaltyInfo(tokenId, salePrice);
    return {
      receiver,
      royaltyAmount: weiToEther(royaltyAmount),
    };
  } catch (error) {
    console.debug('Error getting royalty info:', error);
    return { receiver: '', royaltyAmount: '0' };
  }
}

// Get treasury address
export async function getTreasuryAddress(contractAddress: string): Promise<string> {
  try {
    const contract = getContractInstance(contractAddress);
    const treasury = await contract.treasury();
    return treasury;
  } catch (error) {
    console.debug('Error getting treasury address:', error);
    return '';
  }
}

// Check if mint is permanently closed
export async function isMintClosed(contractAddress: string): Promise<boolean> {
  try {
    const contract = getContractInstance(contractAddress);
    const closed = await contract.mintPermanentlyClosed();
    return Boolean(closed);
  } catch (error) {
    console.debug('Error checking if mint closed:', error);
    return false;
  }
}

// Get base CID hash
export async function getBaseCIDHash(contractAddress: string): Promise<string> {
  try {
    const contract = getContractInstance(contractAddress);
    const hash = await contract.BASE_CID_HASH();
    return hash;
  } catch (error) {
    console.debug('Error getting base CID hash:', error);
    return '';
  }
}

// Get provenance hash
export async function getProvenanceHash(contractAddress: string): Promise<string> {
  try {
    const contract = getContractInstance(contractAddress);
    const hash = await contract.PROVENANCE_HASH();
    return hash;
  } catch (error) {
    console.debug('Error getting provenance hash:', error);
    return '';
  }
}

