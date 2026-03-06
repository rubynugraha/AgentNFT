# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built application from base stage
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.mjs ./next.config.mjs

# Expose port 3000
EXPOSE 3000

# Set environment variables (these should be overridden at runtime with actual values)
ENV NODE_ENV=production
ENV NEXT_PUBLIC_RPC_URL=https://mainnet.base.org
ENV NEXT_PUBLIC_CONTRACT_ADDRESS=0x66f523963454463fCD1Dca0f25C80D554313a41f
ENV NEXT_PUBLIC_CHAIN_ID=8453
ENV NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud
ENV NEXT_PUBLIC_APP_URL=http://localhost:3000

# Start the application
CMD ["pnpm", "start"]