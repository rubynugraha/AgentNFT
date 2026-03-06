-- Create whitelisted_wallets table
CREATE TABLE IF NOT EXISTS whitelisted_wallets (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  discord_username VARCHAR(255),
  twitter_handle VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  registered_at TIMESTAMP NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMP,
  approved_by_admin VARCHAR(255),
  notes TEXT
);

-- Create mint_records table
CREATE TABLE IF NOT EXISTS mint_records (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(255) NOT NULL,
  token_id BIGINT NOT NULL UNIQUE,
  transaction_hash VARCHAR(255),
  is_whitelist_mint BOOLEAN NOT NULL DEFAULT false,
  mint_price_wei VARCHAR(255), -- Store as string to handle big numbers
  minted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  metadata_uri TEXT NOT NULL,
  image_url TEXT,
  FOREIGN KEY (wallet_address) REFERENCES whitelisted_wallets(wallet_address)
);

-- Create nft_metadata table for storing metadata
CREATE TABLE IF NOT EXISTS nft_metadata (
  id SERIAL PRIMARY KEY,
  token_id BIGINT NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  attributes JSONB,
  ipfs_hash VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert initial settings
INSERT INTO admin_settings (setting_key, setting_value)
VALUES 
  ('whitelist_start_date', NOW()::text),
  ('whitelist_end_date', (NOW() + INTERVAL '7 days')::text),
  ('whitelist_price_wei', '100000000000000000'), -- 0.1 ETH in wei
  ('public_price_wei', '200000000000000000'), -- 0.2 ETH in wei
  ('max_supply', '10000'),
  ('base_uri', 'ipfs://'),
  ('contract_address', ''),
  ('admin_wallet', '0x0000000000000000000000000000000000000000')
ON CONFLICT (setting_key) DO NOTHING;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_wallet_status ON whitelisted_wallets(wallet_address, status);
CREATE INDEX IF NOT EXISTS idx_mint_wallet ON mint_records(wallet_address);
CREATE INDEX IF NOT EXISTS idx_mint_token_id ON mint_records(token_id);
CREATE INDEX IF NOT EXISTS idx_metadata_token_id ON nft_metadata(token_id);
