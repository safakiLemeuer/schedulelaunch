#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# ScheduleLaunch — Hostinger VPS Deployment Script
# Run as root: bash setup-vps.sh
# ═══════════════════════════════════════════════════════════════

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════╗"
echo "║       🚀 ScheduleLaunch VPS Setup Script         ║"
echo "║       gsa.thebhtlabs.com              ║"
echo "╚═══════════════════════════════════════════════════╝"
echo -e "${NC}"

# ─── Step 1: System Update ───────────────────────────────────
echo -e "${YELLOW}[1/8] Updating system packages...${NC}"
apt update && apt upgrade -y

# ─── Step 2: Install Docker ──────────────────────────────────
echo -e "${YELLOW}[2/8] Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo -e "${GREEN}✓ Docker installed${NC}"
else
    echo -e "${GREEN}✓ Docker already installed${NC}"
fi

# Install Docker Compose plugin if not present
if ! docker compose version &> /dev/null; then
    apt install -y docker-compose-plugin
    echo -e "${GREEN}✓ Docker Compose plugin installed${NC}"
else
    echo -e "${GREEN}✓ Docker Compose already installed${NC}"
fi

# ─── Step 3: Install Nginx ───────────────────────────────────
echo -e "${YELLOW}[3/8] Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
    echo -e "${GREEN}✓ Nginx installed${NC}"
else
    echo -e "${GREEN}✓ Nginx already installed${NC}"
fi

# ─── Step 4: Install Certbot ─────────────────────────────────
echo -e "${YELLOW}[4/8] Installing Certbot for SSL...${NC}"
if ! command -v certbot &> /dev/null; then
    apt install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✓ Certbot installed${NC}"
else
    echo -e "${GREEN}✓ Certbot already installed${NC}"
fi

# ─── Step 5: Clone Repository ────────────────────────────────
echo -e "${YELLOW}[5/8] Cloning ScheduleLaunch repository...${NC}"
if [ -d "/opt/schedulelaunch" ]; then
    echo -e "${YELLOW}Directory exists. Pulling latest...${NC}"
    cd /opt/schedulelaunch && git pull origin main
else
    git clone https://github.com/safakiLemeuer/schedulelaunch.git /opt/schedulelaunch
fi
cd /opt/schedulelaunch
echo -e "${GREEN}✓ Repository ready at /opt/schedulelaunch${NC}"

# ─── Step 6: Generate Secrets ─────────────────────────────────
echo -e "${YELLOW}[6/8] Setting up environment...${NC}"
NEXTAUTH_SECRET=$(openssl rand -base64 32)
DB_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32)

if [ ! -f "/opt/schedulelaunch/.env" ]; then
    cat > /opt/schedulelaunch/.env << ENVEOF
# ═══════════════════════════════════════════════════════════
# ScheduleLaunch Environment — AUTO-GENERATED $(date)
# ═══════════════════════════════════════════════════════════

# Database (auto-generated — do not change)
DB_PASSWORD=${DB_PASSWORD}
DATABASE_URL=postgresql://schedulelaunch:${DB_PASSWORD}@db:5432/schedulelaunch?schema=public

# NextAuth (auto-generated)
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=https://gsa.thebhtlabs.com

# ─── YOU MUST FILL THESE IN ──────────────────────────────
# Google OAuth (https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID=PASTE_YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=PASTE_YOUR_GOOGLE_CLIENT_SECRET_HERE

# LinkedIn OAuth (https://www.linkedin.com/developers/apps)
LINKEDIN_CLIENT_ID=PASTE_YOUR_LINKEDIN_CLIENT_ID_HERE
LINKEDIN_CLIENT_SECRET=PASTE_YOUR_LINKEDIN_CLIENT_SECRET_HERE

# Anthropic API (https://console.anthropic.com/settings/keys)
ANTHROPIC_API_KEY=PASTE_YOUR_ANTHROPIC_API_KEY_HERE
ENVEOF

    echo -e "${GREEN}✓ .env created with auto-generated secrets${NC}"
    echo -e "${RED}⚠️  You MUST edit .env to add OAuth and API keys!${NC}"
else
    echo -e "${GREEN}✓ .env already exists — not overwriting${NC}"
fi

# ─── Step 7: Configure Nginx ─────────────────────────────────
echo -e "${YELLOW}[7/8] Configuring Nginx...${NC}"
cp /opt/schedulelaunch/nginx/gsa.thebhtlabs.com /etc/nginx/sites-available/gsa.thebhtlabs.com

# Remove default site if it exists
rm -f /etc/nginx/sites-enabled/default

# Enable our site
ln -sf /etc/nginx/sites-available/gsa.thebhtlabs.com /etc/nginx/sites-enabled/gsa.thebhtlabs.com

# Test and reload
nginx -t && systemctl reload nginx
echo -e "${GREEN}✓ Nginx configured${NC}"

# ─── Step 8: Firewall ────────────────────────────────────────
echo -e "${YELLOW}[8/8] Configuring firewall...${NC}"
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp    # SSH
    ufw allow 80/tcp    # HTTP
    ufw allow 443/tcp   # HTTPS
    ufw --force enable
    echo -e "${GREEN}✓ Firewall configured (22, 80, 443 open)${NC}"
else
    echo -e "${YELLOW}⚠ UFW not found — make sure ports 22, 80, 443 are open in Hostinger panel${NC}"
fi

# ═══════════════════════════════════════════════════════════════
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════╗"
echo -e "║       ✅ VPS Setup Complete!                      ║"
echo -e "╚═══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}REMAINING STEPS (do these in order):${NC}"
echo ""
echo -e "  ${RED}1. EDIT YOUR .ENV FILE:${NC}"
echo -e "     nano /opt/schedulelaunch/.env"
echo -e "     → Add Google OAuth credentials"
echo -e "     → Add LinkedIn OAuth credentials"  
echo -e "     → Add Anthropic API key"
echo ""
echo -e "  ${RED}2. GET SSL CERTIFICATE:${NC}"
echo -e "     certbot --nginx -d gsa.thebhtlabs.com"
echo ""
echo -e "  ${RED}3. BUILD & LAUNCH:${NC}"
echo -e "     cd /opt/schedulelaunch"
echo -e "     docker compose up -d --build"
echo ""
echo -e "  ${RED}4. VERIFY:${NC}"
echo -e "     Visit https://gsa.thebhtlabs.com"
echo ""
echo -e "${GREEN}Database password and NextAuth secret have been auto-generated.${NC}"
echo -e "${GREEN}They are stored in /opt/schedulelaunch/.env${NC}"
echo ""
