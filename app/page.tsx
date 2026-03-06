'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import FeatureGrid from '@/components/feature-grid';
import CollectionShowcase from '@/components/collection-showcase';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-semibold">
              AI Agent NFT Collection
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="gradient-text">Cloud Painter Bot</span>
          </h1>

          {/* hero image */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            <Image
              src="/nft-001-blush-pink.jpg"
              alt="Cloud Painter Bot Collection"
              fill
              className="object-cover rounded-xl shadow-lg"
              sizes="(max-width: 768px) 100vw, 20vw"
            />
          </div>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
            Mint your unique AI Agent NFT - 1,000 total supply with 5 rarity tiers from Common to Legendary. Each token is a one-of-a-kind digital artifact on Base Mainnet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/mint">
              <Button className="btn-glow min-w-56 text-lg">Mint Now (FCFS)</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-foreground">Collection Features</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto text-lg">
            Discover what makes AI Agent NFTs unique and valuable
          </p>
          <FeatureGrid />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-foreground mb-16">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Wallet',
                description:
                  'Connect your wallet to begin minting. Our platform supports MetaMask, WalletConnect, and other popular Web3 wallets.',
              },
              {
                step: '02',
                title: 'Check Availability',
                description:
                  'NFTs are minted on a first-come-first-served basis. Check which rarity tier is available and proceed to mint.',
              },
              {
                step: '03',
                title: 'Mint Your NFT',
                description:
                  'Mint your unique AI-generated NFT directly to your wallet. Each NFT is completely unique and stored on IPFS.',
              },
            ].map((item, idx) => (
              <div key={idx} className="card-nft">
                <div className="text-4xl font-bold text-accent/50 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 md:px-8 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Total Supply', value: '1,000 NFTs' },
              { label: 'Standard', value: 'ERC-721' },
              { label: 'Symbol', value: 'AIA' },
              { label: 'Chain', value: 'Base Mainnet' },
            ].map((stat, idx) => (
              <div key={idx} className="glow-border p-6">
                <div className="text-muted-foreground text-sm uppercase tracking-widest mb-2">{stat.label}</div>
                <div className="glow-text text-3xl">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collection Showcase */}
      <CollectionShowcase />

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center glow-border p-12">
          <h2 className="text-4xl font-bold mb-6">Ready to Mint?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join our community of collectors and secure your unique AI Agent NFT today. 1,000 total NFTs across 5 rarity tiers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/mint">
              <Button className="btn-glow min-w-48">Start Minting</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
