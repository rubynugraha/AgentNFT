import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function setupDatabase() {
  try {
    console.log('Starting database setup...');

    // Create whitelisted_wallets table
    await sql`
      CREATE TABLE IF NOT EXISTS whitelisted_wallets (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        approved_at TIMESTAMP,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approved_by VARCHAR(255)
      );
    `;
    console.log('Created whitelisted_wallets table');

    // Create mint_records table
    await sql`
      CREATE TABLE IF NOT EXISTS mint_records (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(255) NOT NULL,
        token_id BIGINT,
        tx_hash VARCHAR(255),
        mint_price NUMERIC,
        is_whitelist_mint BOOLEAN DEFAULT false,
        minted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created mint_records table');

    // Create nft_metadata table
    await sql`
      CREATE TABLE IF NOT EXISTS nft_metadata (
        id SERIAL PRIMARY KEY,
        token_id BIGINT NOT NULL UNIQUE,
        name VARCHAR(255),
        description TEXT,
        image_url VARCHAR(500),
        ipfs_hash VARCHAR(255),
        attributes JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created nft_metadata table');

    // Create admin_settings table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_settings (
        id SERIAL PRIMARY KEY,
        admin_wallet VARCHAR(255) NOT NULL UNIQUE,
        role VARCHAR(50) DEFAULT 'moderator',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created admin_settings table');

    // Create whitelist_config table
    await sql`
      CREATE TABLE IF NOT EXISTS whitelist_config (
        id SERIAL PRIMARY KEY,
        campaign_name VARCHAR(255) DEFAULT 'AI Agent NFT',
        whitelist_start_date TIMESTAMP,
        whitelist_end_date TIMESTAMP,
        public_mint_start_date TIMESTAMP,
        whitelist_price NUMERIC DEFAULT 0.01,
        public_price NUMERIC DEFAULT 0.05,
        max_supply BIGINT DEFAULT 10000,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created whitelist_config table');

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_wallet_status ON whitelisted_wallets(wallet_address, status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_mint_wallet ON mint_records(wallet_address);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_metadata_token ON nft_metadata(token_id);`;

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Database setup error:', error);
    process.exit(1);
  }
}

setupDatabase();
