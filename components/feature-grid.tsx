'use client';

export default function FeatureGrid() {
  const features = [
    {
      icon: '',
      title: 'AI-Generated Art',
      description: 'Each NFT features unique AI-created artwork, ensuring no two tokens are identical.',
    },
    {
      icon: '',
      title: 'Base Mainnet',
      description: 'Deployed on Base Mainnet for fast, cheap transactions and seamless interoperability.',
    },
    {
      icon: '',
      title: 'IPFS Storage',
      description: 'All metadata and images stored on IPFS via Pinata for permanent, decentralized hosting.',
    },
    {
      icon: '',
      title: 'Secure Smart Contract',
      description: 'Audited ERC-721 contract with whitelist protection and admin controls.',
    },
    {
      icon: '',
      title: 'Whitelist Benefits',
      description: 'Early supporters get 98% discount: 0.001 ETH during 1-day whitelist period. Limited to 500 NFTs.',
    },
    {
      icon: '',
      title: 'OpenSea Ready',
      description: 'Full OpenSea integration with rich metadata for beautiful NFT listings.',
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, idx) => (
        <div key={idx} className="card-nft stagger-child hover:animate-glow transition-all duration-300">
          <div className="text-4xl mb-4 animate-float" style={{ animationDelay: `${idx * 0.15}s` }}>
            {feature.icon}
          </div>
          <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
