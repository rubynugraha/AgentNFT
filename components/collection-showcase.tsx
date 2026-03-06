import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface NFT {
  id: number;
  name: string;
  description: string;
  color: string;
  mood: string;
  rarity: string;
  image: string;
  edition: number;
  attributes: Array<{ trait_type: string; value: string }>;
}

const nfts: NFT[] = [
  {
    id: 1,
    name: 'Cloud Painter Bot #001 - Blush Pink',
    description: 'A joyful AI painter robot standing on a crystal platform, holding a brush and empty canvas. Blush Pink edition.',
    color: 'Blush Pink',
    mood: 'Happy',
    rarity: 'Rare',
    image: '/nft-001-blush-pink.jpg',
    edition: 1,
    attributes: [
      { trait_type: 'Color', value: 'Blush Pink' },
      { trait_type: 'Mood', value: 'Happy' },
      { trait_type: 'Accessory', value: 'Paint Brush' },
      { trait_type: 'Platform', value: 'Crystal Base' },
      { trait_type: 'Background', value: 'Soft Watercolor Cloud' },
      { trait_type: 'Rarity', value: 'Rare' },
    ],
  },
  {
    id: 2,
    name: 'Cloud Painter Bot #002 - Sky Blue',
    description: 'A joyful AI painter robot standing on a crystal platform, holding a brush and empty canvas. Sky Blue edition.',
    color: 'Sky Blue',
    mood: 'Happy',
    rarity: 'Rare',
    image: '/nft-002-sky-blue.jpg',
    edition: 1,
    attributes: [
      { trait_type: 'Color', value: 'Sky Blue' },
      { trait_type: 'Mood', value: 'Happy' },
      { trait_type: 'Accessory', value: 'Paint Brush' },
      { trait_type: 'Platform', value: 'Crystal Base' },
      { trait_type: 'Background', value: 'Sunset Cloud' },
      { trait_type: 'Rarity', value: 'Rare' },
    ],
  },
  {
    id: 3,
    name: 'Cloud Painter Bot #003 - Lavender Dream',
    description: 'A joyful AI painter robot standing on a crystal platform, holding a brush and empty canvas. Lavender Dream edition.',
    color: 'Lavender',
    mood: 'Happy',
    rarity: 'Ultra Rare',
    image: '/nft-003-lavender.jpg',
    edition: 1,
    attributes: [
      { trait_type: 'Color', value: 'Lavender' },
      { trait_type: 'Mood', value: 'Happy' },
      { trait_type: 'Accessory', value: 'Paint Brush' },
      { trait_type: 'Platform', value: 'Crystal Base' },
      { trait_type: 'Background', value: 'Pastel Cloud Mix' },
      { trait_type: 'Rarity', value: 'Ultra Rare' },
    ],
  },
  {
    id: 4,
    name: 'Cloud Painter Bot #004 - Sunset Coral',
    description: 'A joyful AI painter robot standing on a crystal platform, holding a brush and empty canvas. Sunset Coral edition.',
    color: 'Coral Orange',
    mood: 'Happy',
    rarity: 'Epic',
    image: '/nft-004-coral.jpg',
    edition: 1,
    attributes: [
      { trait_type: 'Color', value: 'Coral Orange' },
      { trait_type: 'Mood', value: 'Happy' },
      { trait_type: 'Accessory', value: 'Paint Brush' },
      { trait_type: 'Platform', value: 'Crystal Base' },
      { trait_type: 'Background', value: 'Aurora Cloud' },
      { trait_type: 'Rarity', value: 'Epic' },
    ],
  },
  {
    id: 5,
    name: 'Cloud Painter Bot #005 - Golden Glow',
    description: 'A joyful AI painter robot standing on a crystal platform, holding a brush and empty canvas. Golden Glow edition.',
    color: 'Golden Yellow',
    mood: 'Happy',
    rarity: 'Legendary',
    image: '/nft-005-golden.jpg',
    edition: 1,
    attributes: [
      { trait_type: 'Color', value: 'Golden Yellow' },
      { trait_type: 'Mood', value: 'Happy' },
      { trait_type: 'Accessory', value: 'Paint Brush' },
      { trait_type: 'Platform', value: 'Crystal Base' },
      { trait_type: 'Background', value: 'Warm Sunset Cloud' },
      { trait_type: 'Rarity', value: 'Legendary' },
    ],
  },
  {
    id: 6,
    name: 'Cloud Painter Bot #006 - Pure White',
    description: 'A joyful AI painter robot standing on a crystal platform, holding a brush and empty canvas. Pure White edition.',
    color: 'Pearl White',
    mood: 'Happy',
    rarity: 'Common',
    image: '/nft-006-white.jpg',
    edition: 1,
    attributes: [
      { trait_type: 'Color', value: 'Pearl White' },
      { trait_type: 'Mood', value: 'Happy' },
      { trait_type: 'Accessory', value: 'Paint Brush' },
      { trait_type: 'Platform', value: 'Crystal Base' },
      { trait_type: 'Background', value: 'Soft Blue Cloud' },
      { trait_type: 'Rarity', value: 'Common' },
    ],
  },
];

const rarityColors = {
  Common: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  Rare: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Ultra Rare': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Epic: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Legendary: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

export default function CollectionShowcase() {
  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Cloud Painter Bot Collection</h2>
          <p className="text-muted-foreground text-lg mb-4">1,000 NFTs - ERC-721 Standard</p>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="glow-border p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Supply</p>
              <p className="text-2xl font-bold text-accent">1,000 NFTs</p>
            </div>
            <div className="glow-border p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Standard</p>
              <p className="text-2xl font-bold text-accent">ERC-721</p>
            </div>
            <div className="glow-border p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Symbol</p>
              <p className="text-2xl font-bold text-accent">AIA</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nfts.map((nft) => (
            <Card key={nft.id} className="overflow-hidden border-border/50 hover:border-accent/50 transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-card">
                <Image
                  src={nft.image}
                  alt={nft.name}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <CardHeader>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <CardTitle className="text-lg">{nft.name}</CardTitle>
                  <Badge
                    className={`whitespace-nowrap border ${rarityColors[nft.rarity as keyof typeof rarityColors] || rarityColors.Rare}`}
                  >
                    {nft.rarity}
                  </Badge>
                </div>
                <CardDescription className="text-sm">{nft.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {nft.attributes.slice(0, 4).map((attr, idx) => (
                      <div key={idx} className="bg-card/50 rounded p-2 border border-border/50">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{attr.trait_type}</p>
                        <p className="text-sm font-semibold text-foreground">{attr.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 glow-border p-8 rounded-lg">
          <h3 className="text-xl font-bold text-foreground mb-4">Collection Details</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-accent mb-3">About AI Agent NFT</h4>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                AI Agent NFT is a collection of 1,000 unique AI-generated NFTs deployed on Base Mainnet. Each token features unique artwork and attributes determined by the smart contract rarity system, creating a diverse ecosystem of digital collectibles.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-accent mb-3">Rarity Distribution</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Legendary (1-50):</span>
                  <span className="font-semibold text-foreground">50 NFTs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Epic (51-150):</span>
                  <span className="font-semibold text-foreground">100 NFTs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ultra Rare (151-400):</span>
                  <span className="font-semibold text-foreground">250 NFTs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rare (401-650):</span>
                  <span className="font-semibold text-foreground">250 NFTs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Common (651-1000):</span>
                  <span className="font-semibold text-foreground">350 NFTs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
