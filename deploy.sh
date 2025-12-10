#!/bin/bash

# Deployment script for Hostinger
# Usage: ./deploy.sh

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo "Please create .env file from .env.production.example"
    exit 1
fi

# Pull latest changes (if using git)
if [ -d .git ]; then
    echo -e "${YELLOW}📥 Pulling latest changes...${NC}"
    git pull origin main || echo "Git pull failed, continuing..."
fi

# Install dependencies (including devDependencies needed for build)
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Build frontend
echo -e "${YELLOW}🔨 Building frontend...${NC}"
NODE_ENV=production npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Error: Build failed! dist directory not found.${NC}"
    exit 1
fi

# Restart PM2 application
echo -e "${YELLOW}🔄 Restarting application...${NC}"
pm2 restart ecosystem.config.js --env production || pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}📊 Check status with: pm2 status${NC}"
echo -e "${GREEN}📝 View logs with: pm2 logs kidchatbox-api${NC}"

