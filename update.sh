#!/bin/bash

# Ensure the script exits if any command fails
set -e

# Color codes
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Run commands sequentially
echo -e "${BLUE}Stashing changes...${NC}"
git stash
echo -e "${BLUE}Clearing stash...${NC}"
git stash clear
echo -e "${BLUE}Pulling latest changes...${NC}"
git pull
echo -e "${BLUE}Installing npm packages...${NC}"
npm i
echo -e "${BLUE}Building project...${NC}"
npm run build
echo -e "${BLUE}Restarting app...${NC}"
pm2 restart app

echo -e "${BLUE}Script completed successfully!${NC}"
