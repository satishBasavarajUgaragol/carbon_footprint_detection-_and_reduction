#!/bin/bash
# setup.sh - Local development environment setup

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Carbon Footprint System Setup ===${NC}"

# Check dependencies
echo -e "${YELLOW}Checking dependencies...${NC}"

# Check .NET SDK
if ! command -v dotnet &> /dev/null; then
    echo -e "${RED}✗ .NET SDK not found. Install from https://dotnet.microsoft.com/download${NC}"
    exit 1
fi
echo -e "${GREEN}✓ .NET SDK $(dotnet --version) found${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found. Install from https://nodejs.org/${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version) found${NC}"

# Check Azure CLI
if ! command -v az &> /dev/null; then
    echo -e "${YELLOW}! Azure CLI not found. Some deployment features won't work.${NC}"
else
    echo -e "${GREEN}✓ Azure CLI $(az version -o tsv | head -1) found${NC}"
fi

# Setup Backend
echo -e "${YELLOW}Setting up backend...${NC}"
cd Backend
dotnet restore
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies restored${NC}"
else
    echo -e "${RED}✗ Failed to restore backend dependencies${NC}"
    exit 1
fi
cd ..

# Setup Frontend
echo -e "${YELLOW}Setting up frontend...${NC}"
cd Frontend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install frontend dependencies${NC}"
    exit 1
fi
cd ..

echo -e "${GREEN}=== Setup Complete ===${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update Backend/appsettings.json with Azure credentials"
echo "2. Run: cd Backend && dotnet run"
echo "3. In a new terminal, run: cd Frontend && npm start"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
