import { NextRequest, NextResponse } from 'next/server';
import { createAndUploadMetadata } from '@/lib/ipfs';
import { saveMetadata, getMetadata } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { tokenId, imageURI, name, description } = await request.json();

    if (!tokenId || !imageURI) {
      return NextResponse.json(
        { error: 'Token ID and Image URI are required' },
        { status: 400 }
      );
    }

    // Check if metadata already exists
    const existing = await getMetadata(BigInt(tokenId));
    if (existing && existing.ipfs_hash) {
      return NextResponse.json(
        {
          message: 'Metadata already exists',
          tokenId: existing.token_id,
          metadataURI: `ipfs://${existing.ipfs_hash}`,
          imageURI: existing.image_url,
          attributes: existing.attributes,
        },
        { status: 200 }
      );
    }

    const attributes: Array<{ trait_type: string; value: string | number }> = [];

    // Create and upload metadata to IPFS
    console.log(`Uploading metadata for token ${tokenId} to IPFS...`);
    const metadataResult = await createAndUploadMetadata(
      tokenId,
      name || 'AI Agent NFT',
      description || `Unique AI Agent NFT from the AI Agent collection. Token ID: ${tokenId}.`,
      imageURI, // Use provided IPFS URI
      attributes
    );

    // Save to database
    await saveMetadata(
      BigInt(tokenId),
      name || `AI Agent NFT #${tokenId}`,
      description || `Unique AI Agent NFT from the AI Agent collection. Token ID: ${tokenId}.`,
      imageURI,
      metadataResult.hash,
      attributes
    );

    return NextResponse.json(
      {
        message: 'Metadata uploaded to IPFS successfully',
        tokenId,
        metadataURI: metadataResult.metadataURI,
        imageURI,
        ipfsHash: metadataResult.hash,
        attributes,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Metadata upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload metadata' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const tokenId = request.nextUrl.searchParams.get('tokenId');

    if (!tokenId) {
      return NextResponse.json(
        { error: 'Token ID is required' },
        { status: 400 }
      );
    }

    const metadata = await getMetadata(BigInt(tokenId));

    if (!metadata) {
      return NextResponse.json(
        { error: 'Metadata not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        tokenId: metadata.token_id,
        name: metadata.name,
        description: metadata.description,
        imageURI: metadata.image_url,
        ipfsHash: metadata.ipfs_hash,
        metadataURI: `ipfs://${metadata.ipfs_hash}`,
        attributes: metadata.attributes,
        createdAt: metadata.created_at,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get metadata error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metadata' },
      { status: 500 }
    );
  }
}
