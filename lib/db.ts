import { neon } from '@neondatabase/serverless';

// Initialize SQL client only if DATABASE_URL is available
let sql: any = null;

function initializeSql() {
  if (!sql && process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
}

// Whitelist operations
export async function addToWhitelist(walletAddress: string, email?: string) {
  try {
    const sqlClient = initializeSql();
    if (!sqlClient) {
      return { wallet_address: walletAddress, status: 'pending' };
    }
    const result = await sqlClient`
      INSERT INTO whitelisted_wallets (wallet_address, email, status)
      VALUES (${walletAddress.toLowerCase()}, ${email || null}, 'pending')
      ON CONFLICT (wallet_address) DO UPDATE SET email = ${email || null}
      RETURNING id, wallet_address, status;
    `;
    return result[0];
  } catch (error) {
    console.error('Error adding to whitelist:', error);
    throw error;
  }
}

export async function getWhitelistStatus(walletAddress: string) {
  try {
    const sqlClient = initializeSql();
    if (!sqlClient) {
      // no database configured, just act as if there's no record
      return null;
    }
    const result = await sqlClient`
      SELECT * FROM whitelisted_wallets
      WHERE wallet_address = ${walletAddress.toLowerCase()};
    `;
    return result[0] || null;
  } catch (error) {
    // log and swallow the error so callers don't crash the API
    console.error('Error getting whitelist status:', error);
    return null;
  }
}

export async function approveWhitelistWallet(walletAddress: string, adminWallet: string) {
  try {
    const sqlClient = initializeSql();
    if (!sqlClient) {
      return { wallet_address: walletAddress, status: 'approved' };
    }
    const result = await sqlClient`
      UPDATE whitelisted_wallets
      SET status = 'approved', approved_at = NOW(), approved_by = ${adminWallet}
      WHERE wallet_address = ${walletAddress.toLowerCase()}
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error('Error approving whitelist wallet:', error);
    throw error;
  }
}

export async function rejectWhitelistWallet(walletAddress: string, adminWallet: string) {
  try {
    const sqlClient = initializeSql();
    if (!sqlClient) {
      return { wallet_address: walletAddress, status: 'rejected' };
    }
    const result = await sqlClient`
      UPDATE whitelisted_wallets
      SET status = 'rejected', approved_at = NOW(), approved_by = ${adminWallet}
      WHERE wallet_address = ${walletAddress.toLowerCase()}
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error('Error rejecting whitelist wallet:', error);
    throw error;
  }
}

export async function getPendingWhitelistRequests(limit = 50) {
  try {
    const sqlClient = initializeSql();
    if (!sqlClient) return [];
    const result = await sqlClient`
      SELECT * FROM whitelisted_wallets
      WHERE status = 'pending'
      ORDER BY registered_at DESC
      LIMIT ${limit};
    `;
    return result;
  } catch (error) {
    console.error('Error getting pending requests:', error);
    throw error;
  }
}

export async function getAllWhitelistWallets(status?: string) {
  try {
    const sqlClient = initializeSql();
    if (!sqlClient) return [];
    const query = status
      ? await sqlClient`
          SELECT * FROM whitelisted_wallets
          WHERE status = ${status}
          ORDER BY registered_at DESC;
        `
      : await sqlClient`
          SELECT * FROM whitelisted_wallets
          ORDER BY registered_at DESC;
        `;
    return query;
  } catch (error) {
    console.error('Error getting whitelist wallets:', error);
    throw error;
  }
}

// Mint records operations
export async function recordMint(
  walletAddress: string,
  tokenId: bigint,
  txHash: string,
  mintPrice: string,
  isWhitelistMint: boolean
) {
  try {
    const sqlClient = initializeSql();
    if (!sqlClient) {
      return { wallet_address: walletAddress, token_id: tokenId };
    }
    const result = await sqlClient`
      INSERT INTO mint_records (wallet_address, token_id, tx_hash, mint_price, is_whitelist_mint)
      VALUES (${walletAddress.toLowerCase()}, ${tokenId}, ${txHash}, ${mintPrice}, ${isWhitelistMint})
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error('Error recording mint:', error);
    throw error;
  }
}

export async function getMintRecords(walletAddress: string) {
  try {
    const sqlClient = initializeSql();
    if (!sqlClient) return [];
    const result = await sqlClient`
      SELECT * FROM mint_records
      WHERE wallet_address = ${walletAddress.toLowerCase()}
      ORDER BY minted_at DESC;
    `;
    return result;
  } catch (error) {
    console.error('Error getting mint records:', error);
    throw error;
  }
}

export async function getAllMintRecords(limit = 100) {
  try {
    const sqlClient = initializeSql();
    if (!sqlClient) return [];
    const result = await sqlClient`
      SELECT * FROM mint_records
      ORDER BY minted_at DESC
      LIMIT ${limit};
    `;
    return result;
  } catch (error) {
    console.error('Error getting all mint records:', error);
    throw error;
  }
}

// NFT Metadata operations
export async function saveMetadata(
  tokenId: bigint,
  name: string,
  description: string,
  imageUrl: string,
  ipfsHash: string,
  attributes: any
) {
  try {
    const sqlClient = initializeSql();
    if (!sqlClient) {
      return { token_id: tokenId, name };
    }
    const result = await sqlClient`
      INSERT INTO nft_metadata (token_id, name, description, image_url, ipfs_hash, attributes)
      VALUES (${tokenId}, ${name}, ${description}, ${imageUrl}, ${ipfsHash}, ${JSON.stringify(attributes)})
      ON CONFLICT (token_id) DO UPDATE SET 
        name = ${name},
        description = ${description},
        image_url = ${imageUrl},
        ipfs_hash = ${ipfsHash},
        attributes = ${JSON.stringify(attributes)}
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error('Error saving metadata:', error);
    throw error;
  }
}

export async function getMetadata(tokenId: bigint) {
  try {
    const sqlClient = initializeSql();
    if (!sqlClient) return null;
    const result = await sqlClient`
      SELECT * FROM nft_metadata
      WHERE token_id = ${tokenId};
    `;
    return result[0] || null;
  } catch (error) {
    console.error('Error getting metadata:', error);
    throw error;
  }
}

// Admin settings operations
export async function addAdmin(adminWallet: string, role = 'moderator') {
  try {
    const sqlClient = initializeSql();
    if (!sqlClient) {
      return { admin_wallet: adminWallet, role };
    }
    const result = await sqlClient`
      INSERT INTO admin_settings (admin_wallet, role)
      VALUES (${adminWallet.toLowerCase()}, ${role})
      ON CONFLICT (admin_wallet) DO UPDATE SET role = ${role}
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error('Error adding admin:', error);
    throw error;
  }
}

export async function getAdmin(adminWallet: string) {
  try {
    const sqlClient = initializeSql();
    if (!sqlClient) return null;
    const result = await sqlClient`
      SELECT * FROM admin_settings
      WHERE admin_wallet = ${adminWallet.toLowerCase()};
    `;
    return result[0] || null;
  } catch (error) {
    console.error('Error getting admin:', error);
    throw error;
  }
}

export async function getAllAdmins() {
  try {
    const sqlClient = initializeSql();
    if (!sqlClient) return [];
    const result = await sqlClient`
      SELECT * FROM admin_settings
      ORDER BY created_at DESC;
    `;
    return result;
  } catch (error) {
    console.error('Error getting all admins:', error);
    throw error;
  }
}

// Whitelist config operations
export async function getWhitelistConfig() {
  try {
    const sqlClient = initializeSql();
    if (!sqlClient) return null;
    const result = await sqlClient`
      SELECT * FROM whitelist_config
      WHERE id = 1;
    `;
    return result[0] || null;
  } catch (error) {
    console.error('Error getting whitelist config:', error);
    throw error;
  }
}

export async function updateWhitelistConfig(config: Partial<any>) {
  try {
    const sqlClient = initializeSql();
    if (!sqlClient) return config;
    const updates = Object.entries(config)
      .map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value}'` : value}`)
      .join(', ');

    const result = await sqlClient`
      UPDATE whitelist_config
      SET ${updates}, updated_at = NOW()
      WHERE id = 1
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error('Error updating whitelist config:', error);
    throw error;
  }
}

export async function initializeWhitelistConfig() {
  try {
    const existing = await getWhitelistConfig();
    if (existing) return existing;

    const sqlClient = initializeSql();
    if (!sqlClient) {
      return { campaign_name: 'AI Agent NFT' };
    }

    const now = Math.floor(Date.now() / 1000);
    const result = await sqlClient`
      INSERT INTO whitelist_config (
        campaign_name,
        whitelist_start_date,
        whitelist_end_date,
        public_mint_start_date
      ) VALUES (
        'AI Agent NFT',
        to_timestamp(${now}),
        to_timestamp(${now + 7 * 24 * 60 * 60}),
        to_timestamp(${now + 7 * 24 * 60 * 60})
      )
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error('Error initializing whitelist config:', error);
    throw error;
  }
}

// Statistics
export async function getWhitelistStats() {
  try {
    const sqlClient = initializeSql();
    if (!sqlClient) {
      return { total: 0, approved: 0, pending: 0, rejected: 0 };
    }
    const result = await sqlClient`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
      FROM whitelisted_wallets;
    `;
    return result[0];
  } catch (error) {
    console.error('Error getting whitelist stats:', error);
    throw error;
  }
}

export async function getMintStats() {
  try {
    const sqlClient = initializeSql();
    if (!sqlClient) {
      return { total_mints: 0, whitelist_mints: 0, public_mints: 0, total_revenue: 0 };
    }
    const result = await sqlClient`
      SELECT
        COUNT(*) as total_mints,
        SUM(CASE WHEN is_whitelist_mint THEN 1 ELSE 0 END) as whitelist_mints,
        SUM(CASE WHEN NOT is_whitelist_mint THEN 1 ELSE 0 END) as public_mints,
        SUM(CAST(mint_price as NUMERIC)) as total_revenue
      FROM mint_records;
    `;
    return result[0];
  } catch (error) {
    console.error('Error getting mint stats:', error);
    throw error;
  }
}
