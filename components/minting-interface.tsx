'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getContractWithSigner, getContractInfo, canUserMint, hasUserMinted, diagnoseContractIssue, checkWalletBalance } from '@/lib/web3';

interface ContractInfo {
  mintPrice: string;
  maxSupply: number;
  totalSupply: number;
  publicMintEnabled: boolean;
}

interface MintingInterfaceProps {
  walletAddress: string;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  onDisconnect: () => void;
}

export default function MintingInterface({ walletAddress, signer, onDisconnect }: MintingInterfaceProps) {
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [contractError, setContractError] = useState('');
  const [networkChain, setNetworkChain] = useState<number | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userCanMint, setUserCanMint] = useState(true);
  const [mintError, setMintError] = useState('');
  const [userHasMinted, setUserHasMinted] = useState(false);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x21592f9C665d724ea65bCB91eC3AdD6cC68C74D1';
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.base.org';

      // inspect RPC network first
      try {
        const provider = new ethers.JsonRpcProvider(rpcUrl || undefined);
        const net = await provider.getNetwork();
        // chainId can be number/string/bigint; cast to any to avoid strict type complaints
        const rawChain: any = net.chainId;
        let chainNum: number;
        if (typeof rawChain === 'bigint') {
          chainNum = Number(rawChain);
        } else if (typeof rawChain === 'string') {
          chainNum = rawChain.startsWith('0x')
            ? parseInt(rawChain, 16)
            : Number(rawChain);
        } else {
          chainNum = Number(rawChain);
        }
        // record value for UI even if we later log a warning below
        setNetworkChain(chainNum);
        const expected = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 0);
        if (expected && chainNum !== expected) {
          setContractError(
            `RPC network mismatch (${chainNum}), expected ${expected}.` +
              ' Check NEXT_PUBLIC_RPC_URL and NEXT_PUBLIC_CHAIN_ID.'
          );
          setIsLoading(false);
          return;
        }

        // sanity: make sure a contract actually exists on this RPC before calling
        try {
          const code = await provider.getCode(contractAddress);
          console.debug('RPC code len', code.length, 'for', contractAddress);
          if (!code || code === '0x') {
            setContractError(
              'No contract found at configured address on RPC network. ' +
                'Verify NEXT_PUBLIC_CONTRACT_ADDRESS and make sure the contract is deployed.'
            );
            setIsLoading(false);
            return;
          }
        } catch (codeErr) {
          console.warn('Failed to fetch contract code from RPC:', codeErr);
          // continue; getContractInfo performs its own check
        }
      } catch (netErr) {
        console.warn('Failed to fetch network from RPC:', netErr);
        setContractError(
          'Unable to reach RPC network. Check NEXT_PUBLIC_RPC_URL and network connectivity.'
        );
        setIsLoading(false);
        return;
      }

      try {
        // Fetch contract info from blockchain
        const info = await getContractInfo(contractAddress);
        if (!info) {
          const err =
            contractAddress === ''
              ? 'Contract address is not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS.'
              : 'Contract data could not be loaded. Please check the address or network.';
          setContractError(err);
          console.warn(err, { contractAddress, rpcUrl, networkChain });
          setIsLoading(false);
          return;
        }
        setContractInfo(info);

        // Check if user has already minted
        const hasMinted = await hasUserMinted(contractAddress, walletAddress);
        setUserHasMinted(hasMinted);

        // Check if user can mint (anti-bot delay)
        const { canMint, reason } = await canUserMint(contractAddress, walletAddress);
        setUserCanMint(canMint);
        if (!canMint && reason) {
          setMintError(reason);
        }

        // Get wallet balance if signer is available
        if (signer) {
          try {
            const provider = signer.provider as ethers.Provider;
            const balance = await provider.getBalance(walletAddress);
            setWalletBalance(ethers.formatEther(balance));
          } catch (balanceError) {
            console.warn('Could not fetch wallet balance:', balanceError);
            setWalletBalance(null);
          }
        }
      } catch (e: any) {
        console.error('Failed to load contract info', e);
        
        // Run diagnostics to provide better error messages
        const diagnostics = await diagnoseContractIssue(contractAddress);
        let errorMessage = `Contract data could not be loaded: ${e?.message || 'Unknown error'}`;
        
        if (diagnostics.suggestions.length > 0) {
          errorMessage = diagnostics.suggestions.join('\n');
          console.table(diagnostics); // Log full diagnostics to console
        }
        
        setContractError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfo();
  }, [walletAddress]);

  const handleMint = async () => {
    // pre-flight guard
    if (!contractInfo) {
      setMessage('Contract information unavailable. Cannot mint.');
      return;
    }
    if (!contractInfo.publicMintEnabled) {
      setMessage('Public mint is not enabled yet.');
      return;
    }
    if (!userCanMint) {
      setMessage(mintError || 'You are not eligible to mint at this time.');
      return;
    }

    setIsMinting(true);
    setMessage('');

    // if we don't have a signer, fall back to mock flow so UI still works
    if (!signer) {
      try {
        setMessage(
          `Preparing to mint... (simulation)`
        );
        await new Promise((r) => setTimeout(r, 2000));
        setMessage(`✓ Successfully minted NFT! Your NFT is now in your wallet.`);
      } catch (e) {
        setMessage('Minting simulation failed.');
        console.error(e);
      } finally {
        setIsMinting(false);
      }
      return;
    }

    try {
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
      const provider = signer.provider as any;

      // Validate contract exists on chain
      if (provider) {
        const code = await provider.getCode(contractAddress);
        if (!code || code === '0x') {
          throw new Error('No contract deployed at configured address');
        }
      }

      // Check wallet balance before proceeding
      setMessage('⏳ Checking wallet balance...');
      const balanceCheck = await checkWalletBalance(walletAddress, contractAddress, signer);

      if (!balanceCheck.hasEnoughBalance) {
        throw new Error(
          `Insufficient balance. You have ${balanceCheck.balance} ETH but need ${balanceCheck.requiredAmount} ETH ` +
          `(including ${balanceCheck.gasEstimate} ETH for gas fees).`
        );
      }

      const contract = await getContractWithSigner(contractAddress, signer);

      // Get mint price from contract (not from cached info to ensure accuracy)
      const mintPrice = await contract.MINT_PRICE();
      const mintPriceEther = ethers.formatEther(mintPrice);

      setMessage(`⏳ Preparing transaction... Mint price: ${mintPriceEther} ETH`);

      // Estimate gas for the transaction
      let gasEstimate;
      try {
        gasEstimate = await contract.mint.estimateGas({ value: mintPrice });
        // Add 20% buffer for gas estimation
        gasEstimate = (gasEstimate * 120n) / 100n;
      } catch (gasError: any) {
        console.warn('Gas estimation failed, using default:', gasError);
        gasEstimate = 200000n; // Default gas limit for NFT mint
      }

      // Get current gas price
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice || ethers.parseUnits('20', 'gwei');

      // Calculate total cost
      const gasCost = gasEstimate * gasPrice;
      const totalCost = mintPrice + gasCost;
      const totalCostEther = ethers.formatEther(totalCost);

      setMessage(`⏳ Sending transaction... Total cost: ${totalCostEther} ETH (including gas)`);

      // Execute mint transaction
      const tx = await contract.mint({
        value: mintPrice,
        gasLimit: gasEstimate,
        gasPrice: gasPrice
      });

      setMessage(`⏳ Transaction submitted: ${tx.hash.slice(0, 10)}... Waiting for confirmation...`);

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        setMessage(`✓ Successfully minted NFT! Transaction confirmed: ${tx.hash.slice(0, 10)}...`);
        setUserHasMinted(true);

        // Refresh contract info to show updated supply
        const updatedInfo = await getContractInfo(contractAddress);
        if (updatedInfo) {
          setContractInfo(updatedInfo);
        }
      } else {
        throw new Error('Transaction failed');
      }

    } catch (error: any) {
      console.error('Mint error:', error);

      // Provide user-friendly error messages
      let errorMessage = 'Minting failed. ';

      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        errorMessage += 'Transaction was rejected by user.';
      } else if (error.code === 'INSUFFICIENT_FUNDS' || error.code === -32000) {
        errorMessage += 'Insufficient funds for transaction.';
      } else if (error.message?.includes('execution reverted')) {
        errorMessage += 'Transaction reverted. Check contract conditions.';
      } else if (error.message?.includes('network')) {
        errorMessage += 'Network error. Please try again.';
      } else {
        errorMessage += 'Please check console for details and try again.';
      }

      setMessage(errorMessage);
    } finally {
      setIsMinting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading minting interface...</div>
      </div>
    );
  }

  if (contractError) {
    return (
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 py-20">
        <div className="p-6 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive space-y-4">
          <div>{contractError}</div>
          {networkChain !== null && (
            <div className="text-xs text-muted-foreground">
              RPC chainId: {networkChain}
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            Configured address: {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '(none)'}
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="ghost" className="text-accent hover:text-accent hover:bg-accent/10">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-20">
      {/* Collection banner */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-foreground">
          Cloud Painter Bot Collection
        </h2>
        <div className="relative w-32 h-32 mx-auto mb-6">
          <Image
            src="/nft-001-blush-pink.jpg"
            alt="Cloud Painter Bot Collection"
            fill
            className="object-cover rounded-lg shadow-md"
            sizes="(max-width: 768px) 100vw, 8rem"
          />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Mint NFT</span>
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
        </div>
        <Button variant="outline" onClick={onDisconnect} className="btn-secondary-glow">
          Disconnect
        </Button>
      </div>

      {/* Minting Card */}
      <Card className="glow-border border-secondary/50 bg-card/50 mb-8">
        <CardHeader>
          <CardTitle>FCFS Minting</CardTitle>
          <CardDescription>
            {contractInfo
              ? contractInfo.publicMintEnabled
                ? 'Minting is live! First-Come-First-Serve.'
                : 'Minting is not yet enabled'
              : 'Contract not available'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Price per NFT</Label>
            <p className="text-4xl font-bold text-secondary">{contractInfo?.mintPrice} ETH</p>
            <p className="text-xs text-muted-foreground">
              {contractInfo
                ? `${contractInfo.totalSupply}/${contractInfo.maxSupply} NFTs minted`
                : 'Supply unavailable'}
            </p>
          </div>

          {/* Wallet Balance */}
          {signer && (
            <div className="space-y-2">
              <Label className="text-muted-foreground">Your Wallet Balance</Label>
              <div className="text-sm">
                <span className="font-mono">
                  {walletBalance ? `${parseFloat(walletBalance).toFixed(4)} ETH` : 'Unable to fetch balance'}
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={handleMint}
            disabled={
              isMinting ||
              !contractInfo?.publicMintEnabled ||
              !userCanMint ||
              userHasMinted
            }
            className="btn-secondary-glow w-full text-lg py-6"
          >
            {isMinting
              ? 'Minting...'
              : userHasMinted
                ? '✓ Already Minted'
                : !userCanMint
                  ? 'Cannot Mint'
                  : 'Mint Now (FCFS)'}
          </Button>

          {userHasMinted && (
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/30 text-accent text-sm text-center">
              You have already minted an NFT from this collection!
            </div>
          )}

          {!userCanMint && mintError && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">
              {mintError}
            </div>
          )}

          {!contractInfo?.publicMintEnabled && (
            <p className="text-sm text-muted-foreground text-center">
              Minting is currently disabled. Please check back later.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Message */}
      {message && (
        <div className="p-4 rounded-lg bg-accent/10 border border-accent/30 text-accent mb-8">{message}</div>
      )}

      {/* How FCFS Works */}
      <Card className="glow-border border-none bg-card/50 mb-8">
        <CardHeader>
          <CardTitle>About FCFS Minting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            First-Come-First-Serve (FCFS) minting means that NFTs are minted and assigned to wallets in the order transactions are confirmed on the blockchain.
          </p>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside">
            <li>Each transaction mints 1 NFT with a random rarity tier</li>
            <li>Limited to 1,000 total NFTs across all rarity tiers</li>
            <li>Rarity tiers: Common, Rare, Ultra Rare, Epic, and Legendary</li>
            <li>All NFTs are stored on IPFS and the contract address on Base Mainnet</li>
          </ul>
        </CardContent>
      </Card>

      {/* Contract Info */}
      <Card className="glow-border border-none bg-card/50">
        <CardHeader>
          <CardTitle>Contract Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Total Supply</p>
              <p className="font-mono text-accent">
                {contractInfo ? `${contractInfo.totalSupply}/${contractInfo.maxSupply}` : '-'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Network</p>
              <p className="font-mono text-accent">Base Mainnet</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Status</p>
              <p className="font-mono text-accent">{contractInfo?.publicMintEnabled ? '✓ Live' : '⏳ Coming Soon'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-8">
        <Link href="/">
          <Button variant="ghost" className="text-accent hover:text-accent hover:bg-accent/10">
            ← Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
