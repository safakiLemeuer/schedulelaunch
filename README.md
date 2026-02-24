# 🚀 ScheduleLaunch — GSA MAS Readiness Platform

**By BHT Solutions** | `gsa.thebhtlabs.com`

AI-powered platform that guides small businesses from zero to GSA Schedule award.

---

## Architecture

```
User → Nginx (SSL) → Next.js App (:3000) → PostgreSQL (:5432)
                                          → Anthropic API (AI Review)
```

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Auth**: NextAuth.js with Google + LinkedIn SSO
- **Database**: PostgreSQL 16 via Prisma ORM
- **AI**: Anthropic Claude API (server-side, key never exposed)
- **Hosting**: Docker on Hostinger VPS + Nginx reverse proxy + Let's Encrypt SSL

---

## Deployment Steps (Hostinger VPS)

### 1. SSH into your VPS

```bash
ssh root@YOUR_VPS_IP
```

### 2. Install Prerequisites

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
apt install -y docker-compose-plugin

# Install Nginx
apt install -y nginx

# Install Certbot for SSL
apt install -y certbot python3-certbot-nginx

# Install Git
apt install -y git
```

### 3. Clone the Repository

```bash
cd /opt
git clone https://github.com/YOUR_USERNAME/schedulelaunch.git
cd schedulelaunch
```

### 4. Set Up Environment Variables

```bash
cp .env.example .env

# Generate NextAuth secret
openssl rand -base64 32
# Copy the output and paste it as NEXTAUTH_SECRET in .env

# Edit .env with your actual values
nano .env
```

**You need to fill in:**

| Variable | Where to Get It |
|----------|----------------|
| `DB_PASSWORD` | Make up a strong password (32+ chars) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | https://console.cloud.google.com/apis/credentials |
| `GOOGLE_CLIENT_SECRET` | Same as above |
| `LINKEDIN_CLIENT_ID` | https://www.linkedin.com/developers/apps |
| `LINKEDIN_CLIENT_SECRET` | Same as above |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com/settings/keys |

### 5. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or select existing)
3. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
4. Application type: **Web application**
5. Name: `ScheduleLaunch`
6. Authorized JavaScript origins: `https://gsa.thebhtlabs.com`
7. Authorized redirect URIs: `https://gsa.thebhtlabs.com/api/auth/callback/google`
8. Copy Client ID and Client Secret to your `.env`

### 6. Set Up LinkedIn OAuth

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)
2. Create a new app
3. Company: Select your company page (or create one)
4. Go to **Auth** tab
5. Add redirect URL: `https://gsa.thebhtlabs.com/api/auth/callback/linkedin`
6. Under **Products**, request access to **Sign In with LinkedIn using OpenID Connect**
7. Copy Client ID and Client Secret to your `.env`

### 7. Configure Nginx

```bash
# Copy nginx config
sudo cp nginx/gsa.thebhtlabs.com /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/gsa.thebhtlabs.com /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Get SSL certificate
sudo certbot --nginx -d gsa.thebhtlabs.com

# Reload Nginx
sudo systemctl reload nginx
```

### 8. Build & Launch

```bash
# Create .env file for Docker Compose
# (copy values from your .env)
export $(cat .env | xargs)

# Build and start everything
docker compose up -d --build

# Check logs
docker compose logs -f app

# Verify database is ready
docker compose exec app npx prisma db push
```

### 9. Verify

1. Visit `https://gsa.thebhtlabs.com`
2. You should see the landing page
3. Click "Continue with Google" — should redirect to Google OAuth
4. After sign-in, you should land on the dashboard
5. Create a new application and test the checklist

---

## DNS Configuration (Already Done)

Your A record for `gsa.thebhtlabs.com` should point to your Hostinger VPS IP address.

```
gsa.thebhtlabs.com  →  A  →  YOUR_VPS_IP
```

---

## Updating the App

```bash
cd /opt/schedulelaunch
git pull origin main
docker compose up -d --build
```

---

## Troubleshooting

**App won't start:**
```bash
docker compose logs app
```

**Database issues:**
```bash
docker compose exec app npx prisma db push
```

**SSL certificate renewal:**
```bash
sudo certbot renew
```

**OAuth callback errors:**
- Check that redirect URIs match EXACTLY (including https://)
- Check that NEXTAUTH_URL in .env matches your domain
- LinkedIn requires "Sign In with LinkedIn using OpenID Connect" product approval

**Nginx 502 Bad Gateway:**
- App container might not be running: `docker compose ps`
- Check app logs: `docker compose logs app`

---

## File Structure

```
schedulelaunch/
├── docker-compose.yml         # Production orchestration
├── Dockerfile                 # Multi-stage build
├── nginx/                     # Nginx reverse proxy config
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # SSO endpoints
│   │   │   ├── applications/        # CRUD API
│   │   │   └── review/              # AI review API
│   │   ├── auth/
│   │   │   ├── signin/              # Custom sign-in page
│   │   │   └── error/               # Auth error page
│   │   ├── dashboard/               # Main dashboard
│   │   ├── application/[id]/
│   │   │   ├── checklist/           # Guided checklist
│   │   │   ├── narratives/          # eOffer narrative editor
│   │   │   ├── labor-categories/    # Labor cat builder
│   │   │   └── review/              # AI CO review
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Landing page
│   ├── components/
│   │   └── Providers.tsx            # Session provider
│   ├── lib/
│   │   ├── auth.ts                  # NextAuth config
│   │   ├── checklist-data.ts        # GSA checklist items
│   │   ├── prisma.ts                # DB client
│   │   └── types.d.ts               # Type extensions
│   └── styles/
│       └── globals.css              # Tailwind + custom styles
├── .env.example                     # Environment template
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## Security Notes

- API key (Anthropic) is server-side only — never exposed to browser
- All auth handled by NextAuth.js with CSRF protection
- Database only accessible from localhost (Docker network)
- Nginx adds security headers (HSTS, X-Frame-Options, etc.)
- SSL via Let's Encrypt with auto-renewal

---

## Future Enhancements

- [ ] Stripe integration for paid tiers
- [ ] PDF export of completed narratives
- [ ] Real-time collaboration (multiple team members)
- [ ] GSA eLibrary rate comparison tool
- [ ] Automated solicitation revision monitoring
- [ ] Template library with pre-written narrative snippets
- [ ] Admin dashboard for BHT to manage users

---

**Built by BHT Solutions** | Bluebery Hawaii Technology Solutions LLC
