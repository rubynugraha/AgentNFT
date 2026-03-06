import axios from 'axios';

// Pinata configuration
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

const pinataAPI = axios.create({
  baseURL: 'https://api.pinata.cloud',
  headers: {
    pinata_api_key: PINATA_API_KEY,
    pinata_secret_api_key: PINATA_API_SECRET,
  },
});

/**
 * Upload metadata JSON to Pinata IPFS
 */
export async function uploadMetadataToIPFS(metadata: {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string | number }>;
}) {
  try {
    const response = await pinataAPI.post('/pinning/pinJSONToIPFS', metadata);

    return {
      hash: response.data.IpfsHash,
      uri: `ipfs://${response.data.IpfsHash}`,
      gateway: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
    };
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw error;
  }
}

/**
 * Upload file (image) to Pinata IPFS
 */
export async function uploadFileToIPFS(file: Buffer, filename: string) {
  try {
    const formData = new FormData();
    const blob = new Blob([file], { type: 'image/png' });
    formData.append('file', blob, filename);
    formData.append('pinataMetadata', JSON.stringify({ name: filename }));

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_API_SECRET,
      },
    });

    return {
      hash: response.data.IpfsHash,
      uri: `ipfs://${response.data.IpfsHash}`,
      gateway: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
    };
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }
}

/**
 * Create metadata for NFT with IPFS image URI
 */
export async function createAndUploadMetadata(
  tokenId: number,
  name: string,
  description: string,
  imageURI: string, // IPFS URI
  attributes: Array<{ trait_type: string; value: string | number }>
) {
  try {
    const metadata = {
      name: `${name} #${tokenId}`,
      description,
      image: imageURI,
      external_url: `https://aiagentnft.io/nft/${tokenId}`,
      attributes: [
        { trait_type: 'Token ID', value: tokenId },
        ...attributes,
        {
          trait_type: 'Created At',
          value: new Date().toISOString(),
        },
      ],
    };

    const result = await uploadMetadataToIPFS(metadata);

    return {
      metadataURI: result.uri,
      metadataGateway: result.gateway,
      hash: result.hash,
    };
  } catch (error) {
    console.error('Error creating and uploading metadata:', error);
    throw error;
  }
}

/**
 * Get gateway URL for IPFS hash
 */
export function getGatewayURL(ipfsHash: string): string {
  return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
}

/**
 * Validate IPFS URI format
 */
export function isValidIPFSURI(uri: string): boolean {
  return /^ipfs:\/\/Qm[a-zA-Z0-9]{44}$/.test(uri);
}
