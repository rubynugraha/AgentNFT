'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MintingInterface from '@/components/minting-interface';
import { getEthereumProvider, hasEthereumProvider } from '@/lib/wallet';

export default function MintPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasEthereum, setHasEthereum] = useState(false);

  // ethers provider/signers created when user has a wallet
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  /**
   * Attempts to connect to a Web3 wallet (e.g. MetaMask).
   * Falls back to manual address entry if no provider is available.
   */
  const connectWallet = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');

    // try wallet provider first
    const ethereum = getEthereumProvider();
    if (ethereum) {
      try {
        const prov = new ethers.BrowserProvider(ethereum);
        const accounts: string[] = await prov.send('eth_requestAccounts', []);
        const address = accounts[0];
        const network = await prov.getNetwork();
        console.log('connected network', network);

        const expectedChain = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 0);
        // normalize chainId (could be big int, number or hex string) - cast to any so TS can narrow
        const rawChain: any = network.chainId;
        let netChain: number = 0;
        if (typeof rawChain === 'bigint') {
          netChain = Number(rawChain);
        } else if (typeof rawChain === 'string') {
          netChain = rawChain.startsWith('0x')
            ? parseInt(rawChain, 16)
            : Number(rawChain);
        } else {
          netChain = Number(rawChain);
        }
        if (expectedChain && netChain !== expectedChain) {
          // try to ask the wallet to switch networks
          // hex value for chain id (ethers.hexValue not exported in v6)
          const hexChain = '0x' + expectedChain.toString(16);
          try {
            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: hexChain }],
            });
            // re-fetch network after switching
            const newNetwork = await prov.getNetwork();
            const newChainNum =
              (() => {
                const x: any = newNetwork.chainId;
                if (typeof x === 'string') {
                  return x.startsWith('0x') ? parseInt(x, 16) : Number(x);
                }
                return Number(x);
              })();
            if (newChainNum !== expectedChain) {
              throw new Error('network switch failed');
            }
          } catch (switchError: any) {
            console.warn('Network switch error:', switchError);
            
            // If network not found (error code 4902), try to add it
            if (switchError.code === 4902) {
              try {
                await ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: hexChain,
                    chainName: 'Base',
                    nativeCurrency: {
                      name: 'Ether',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                    rpcUrls: ['https://mainnet.base.org'],
                    blockExplorerUrls: ['https://basescan.org'],
                  }],
                });
                
                // After adding, try switching again
                await ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: hexChain }],
                });
                
                // Verify the switch worked
                const finalNetwork = await prov.getNetwork();
                const finalChainNum = (() => {
                  const x: any = finalNetwork.chainId;
                  if (typeof x === 'string') {
                    return x.startsWith('0x') ? parseInt(x, 16) : Number(x);
                  }
                  return Number(x);
                })();
                
                if (finalChainNum !== expectedChain) {
                  throw new Error('network switch failed after adding');
                }
              } catch (addError: any) {
                console.warn('Failed to add Base network:', addError);
                setError(`Please manually add Base Mainnet to your wallet and switch to it. Chain ID: ${expectedChain}`);
                setIsLoading(false);
                return;
              }
            } else {
              setError(`Please switch your wallet to chain ID ${expectedChain} (Base Mainnet).`);
              setIsLoading(false);
              return;
            }
          }
        }

        const sign = await prov.getSigner();

        setProvider(prov);
        setSigner(sign);
        setWalletAddress(address);
        setIsConnected(true);
        localStorage.setItem('userWallet', address);
        setIsLoading(false);
        return;
      } catch (err) {
        console.error('Provider connection error:', err);
        setError('Failed to connect to wallet provider.');
        setIsLoading(false);
        return;
      }
    }

    // no provider - fall back to manual entry
    if (walletAddress.trim() === '') {
      setError('No Web3 wallet detected and no address entered.');
      setIsLoading(false);
      return;
    }

    if (!walletAddress.startsWith('0x') || walletAddress.length !== 42) {
      setError('Invalid wallet address format');
      setIsLoading(false);
      return;
    }

    setIsConnected(true);
    localStorage.setItem('userWallet', walletAddress);
    setIsLoading(false);
  };

  const disconnect = () => {
    setIsConnected(false);
    setWalletAddress('');
    localStorage.removeItem('userWallet');
  };

  useEffect(() => {
    // determine if a Web3 provider is injected (client only)
    try {
      if (hasEthereumProvider()) {
        setHasEthereum(true);
      }
    } catch (error) {
      console.warn('Error detecting Ethereum provider:', error);
      // Continue without ethereum detection
    }

    const saved = localStorage.getItem('userWallet');
    if (saved) {
      setWalletAddress(saved);
      setIsConnected(true);
    }
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      {!isConnected ? (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 md:px-8 py-20">
          <div className="max-w-md w-full">
            {/* collection banner */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Cloud Painter Bot Collection
              </h2>
              <div className="relative w-48 h-48 mx-auto mb-6">
                <Image
                  src="/nft-001-blush-pink.jpg"
                  alt="Cloud Painter Bot #001"
                  fill
                  className="object-cover rounded-lg shadow-md"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Connect Wallet</span>
              </h1>
              <p className="text-muted-foreground">
                {hasEthereum
                  ? 'Click the button below to connect your Web3 wallet'
                  : 'No wallet detected – you may paste an address manually'}
              </p>
            </div>

            <div className="glow-border p-8 space-y-5">
              {!hasEthereum && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Wallet Address (manual)
                  </label>
                  <Input
                    type="text"
                    placeholder="0x..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="bg-input border-border text-foreground placeholder-muted-foreground"
                    disabled={isLoading}
                  />
                </div>
              )}

              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  {error}
                </div>
              )}

              <Button onClick={() => connectWallet()} disabled={isLoading} className="btn-glow w-full">
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>

            <div className="mt-8 glow-border p-6">
              <h3 className="font-semibold text-foreground mb-3">FCFS Minting Information</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-accent">•</span>
                  <span>First-Come-First-Serve minting</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent">•</span>
                  <span>1,000 total NFTs available</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent">•</span>
                  <span>5 rarity tiers: Common, Rare, Ultra Rare, Epic, Legendary</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent">•</span>
                  <span>Base Mainnet deployment</span>
                </li>
              </ul>
            </div>

            <div className="text-center mt-8">
              <Link href="/">
                <Button variant="ghost" className="text-accent hover:text-accent hover:bg-accent/10">
                  ← Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <MintingInterface
          walletAddress={walletAddress}
          provider={provider}
          signer={signer}
          onDisconnect={disconnect}
        />
      )}
    </main>
  );
}
