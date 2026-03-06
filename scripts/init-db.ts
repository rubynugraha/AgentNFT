import { neon } from '@neondatabase/serverless';

/**
 * Initialize Neon PostgreSQL Database
 * 
 * This script creates all necessary tables for the AINFT application:
 * - whitelisted_wallets: Track whitelist registrations
 * - mint_records: Record all NFT mints
 * - nft_metadata: Store NFT metadata
 * - admin_settings: Admin configuration
 * - whitelist_config: Campaign configuration
 * 
 * Run with: npx ts-node scripts/init-db.ts
 */

async function initializeDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('ERROR: DATABASE_URL environment variable is not set');
    console.error('Please set DATABASE_URL in your .env.local file');
    process.exit(1);
  }

  console.log('Initializing Neon PostgreSQL Database...');
  console.log('Database URL:', databaseUrl.split('?')[0]); // Don't log credentials

  const sql = neon(databaseUrl);

  try {
    // Create whitelisted_wallets table
    console.log('\n1/5: Creating whitelisted_wallets table...');
    await sql`
      CREATE TABLE IF NOT EXISTS whitelisted_wallets (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(42) UNIQUE NOT NULL,
        email VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending',
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approved_at TIMESTAMP,
        approved_by VARCHAR(42),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_whitelisted_wallets_status ON whitelisted_wallets(status);
      CREATE INDEX IF NOT EXISTS idx_whitelisted_wallets_wallet ON whitelisted_wallets(wallet_address);
    `;
    console.log('✓ whitelisted_wallets table created');

    // Create mint_records table
    console.log('\n2/5: Creating mint_records table...');
    await sql`
      CREATE TABLE IF NOT EXISTS mint_records (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(42) NOT NULL,
        token_id BIGINT NOT NULL,
        tx_hash VARCHAR(255) UNIQUE,
        mint_price VARCHAR(100),
        is_whitelist_mint BOOLEAN DEFAULT FALSE,
        minted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_mint_records_wallet ON mint_records(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_mint_records_token ON mint_records(token_id);
    `;
    console.log('✓ mint_records table created');

    // Create nft_metadata table
    console.log('\n3/5: Creating nft_metadata table...');
    await sql`
      CREATE TABLE IF NOT EXISTS nft_metadata (
        id SERIAL PRIMARY KEY,
        token_id BIGINT UNIQUE NOT NULL,
        name VARCHAR(255),
        description TEXT,
        image_url VARCHAR(500),
        ipfs_hash VARCHAR(100),
        attributes JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_nft_metadata_token ON nft_metadata(token_id);
      CREATE INDEX IF NOT EXISTS idx_nft_metadata_ipfs ON nft_metadata(ipfs_hash);
    `;
    console.log('✓ nft_metadata table created');

    // Create admin_settings table
    console.log('\n4/5: Creating admin_settings table...');
    await sql`
      CREATE TABLE IF NOT EXISTS admin_settings (
        id SERIAL PRIMARY KEY,
        admin_wallet VARCHAR(42) UNIQUE NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_admin_settings_wallet ON admin_settings(admin_wallet);
    `;
    console.log('✓ admin_settings table created');

    // Create whitelist_config table
    console.log('\n5/5: Creating whitelist_config table...');
    await sql`
      CREATE TABLE IF NOT EXISTS whitelist_config (
        id SERIAL PRIMARY KEY,
        campaign_name VARCHAR(255) DEFAULT 'AI Agent NFT',
        whitelist_price VARCHAR(100) DEFAULT '0.001',
        public_price VARCHAR(100) DEFAULT '0.05',
        whitelist_start_date TIMESTAMP,
        whitelist_end_date TIMESTAMP,
        public_mint_start_date TIMESTAMP,
        max_whitelist_quantity INT DEFAULT 1000,
        max_public_quantity INT DEFAULT 5000,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✓ whitelist_config table created');

    // Initialize default whitelist config if not exists
    console.log('\nInitializing default whitelist configuration...');
    const existing = await sql`SELECT COUNT(*) as count FROM whitelist_config;`;
    
    if (existing[0].count === 0) {
      const now = new Date();
      const whitelistEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day
      const publicStart = whitelistEnd;
      const publicEnd = new Date(publicStart.getTime() + 72 * 60 * 60 * 1000); // 3 days

      await sql`
        INSERT INTO whitelist_config (
          campaign_name,
          whitelist_price,
          public_price,
          whitelist_start_date,
          whitelist_end_date,
          public_mint_start_date
        ) VALUES (
          'AI Agent NFT',
          '0.001',
          '0.05',
          ${now.toISOString()},
          ${whitelistEnd.toISOString()},
          ${publicStart.toISOString()}
        );
      `;
      console.log('✓ Default whitelist config initialized');
    } else {
      console.log('✓ Whitelist config already initialized');
    }

    console.log('\n✨ Database initialization completed successfully!');
    console.log('\nDatabase is ready to use. All tables have been created:');
    console.log('  - whitelisted_wallets');
    console.log('  - mint_records');
    console.log('  - nft_metadata');
    console.log('  - admin_settings');
    console.log('  - whitelist_config');
    
  } catch (error) {
    console.error('\n✗ Database initialization failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();
