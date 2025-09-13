# 🚀 Stocky Deployment Guide

Complete guide for deploying Stocky to free hosting platforms.

## 📋 Prerequisites

Before deployment, ensure you have:

- Node.js 18+ installed
- Git repository with your code
- GitHub account for repositories and automation
- Free accounts on chosen platforms (Netlify, Vercel, Railway, Render)

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│    Backend      │
│  Netlify/Vercel │    │ Railway/Render  │
│  React + Vite   │    │ Node.js/Express │
└─────────────────┘    └─────────────────┘
                              │
                    ┌─────────────────┐
                    │   Database      │
                    │ PostgreSQL/SQLite│
                    └─────────────────┘
```

## 🔧 Frontend Deployment

### Option 1: Netlify (Recommended)

#### Step 1: Prepare Repository
1. Push your code to GitHub
2. Ensure `netlify.toml` is in root directory

#### Step 2: Deploy to Netlify
1. Visit [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

#### Step 3: Environment Variables
Add these environment variables in Netlify dashboard:
```
VITE_API_BASE_URL=https://your-backend-url.railway.app/api
```

#### Step 4: Custom Domain (Optional)
- Add custom domain in site settings
- Configure DNS to point to Netlify

### Option 2: Vercel

#### Step 1: Deploy to Vercel
1. Visit [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel auto-detects Vite configuration

#### Step 2: Environment Variables
Add in Vercel dashboard:
```
VITE_API_BASE_URL=https://your-backend-url.railway.app/api
NODE_ENV=production
```

## 🖥️ Backend Deployment

### Option 1: Railway (Recommended)

#### Step 1: Prepare Repository
1. Ensure `railway.toml` is in backend root
2. Add PostgreSQL-compatible database code

#### Step 2: Deploy to Railway
1. Visit [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your backend repository
4. Railway auto-detects Node.js

#### Step 3: Add Database
1. Click "Add service" → "Database" → "PostgreSQL"
2. Railway automatically provides `DATABASE_URL`

#### Step 4: Environment Variables
Set these in Railway dashboard:
```bash
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-here
CORS_ORIGIN=https://your-frontend-url.netlify.app
CACHE_TTL=300
STOCK_CACHE_TTL=60
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=1000

# Optional API Keys
ALPHA_VANTAGE_API_KEY=your_key_here
FMP_API_KEY=your_key_here
FINNHUB_API_KEY=your_key_here
```

#### Step 5: Custom Domain (Optional)
- Add custom domain in Railway settings
- Update CORS_ORIGIN with new domain

### Option 2: Render

#### Step 1: Deploy to Render
1. Visit [render.com](https://render.com) and sign in
2. Click "New" → "Web Service"
3. Connect your GitHub repository

#### Step 2: Configuration
- Build Command: `npm install`
- Start Command: `npm start`
- Environment: Node
- Plan: Free

#### Step 3: Add Database
1. Create new PostgreSQL database service
2. Use provided connection string as `DATABASE_URL`

## 🗄️ Database Setup

### Development (SQLite)
```bash
# Already configured - no setup needed
# Database file: ./stocky.db
```

### Production (PostgreSQL)
```sql
-- Automatically handled by Railway/Render
-- Database URL format: postgresql://user:pass@host:port/db
```

## 🔒 Security Configuration

### Environment Variables
Never commit these to git:
```bash
# Backend .env (production)
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=super-secure-random-string
CORS_ORIGIN=https://your-domain.com

# Frontend environment (Netlify/Vercel)
VITE_API_BASE_URL=https://api.your-domain.com
```

### CORS Setup
Configure allowed origins:
```javascript
// In backend server.js
app.use(cors({
  origin: [
    'https://your-frontend.netlify.app',
    'https://your-frontend.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

## 🔄 CI/CD Setup

### GitHub Actions (Already configured)

#### Frontend Workflow: `.github/workflows/deploy.yml`
```yaml
name: Deploy Stocky Frontend
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci && npm run build
      - uses: netlify/actions/deploy@master
```

#### Backend Workflow: `stocky-backend/.github/workflows/deploy.yml`
```yaml
name: Deploy Stocky Backend
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: railway/deployment@v1
```

## 🧪 Testing Deployment

### 1. Health Checks
```bash
# Test backend health
curl https://your-backend.railway.app/health

# Expected response:
{"status":"healthy","timestamp":"2025-01-01T00:00:00.000Z"}
```

### 2. API Testing
```bash
# Test stock data API
curl https://your-backend.railway.app/api/stocks/quote/AAPL

# Test authentication
curl -X POST https://your-backend.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### 3. Frontend Testing
1. Visit your deployed frontend URL
2. Complete onboarding flow
3. Test stock search and trading
4. Verify portfolio updates

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check Node version
node --version  # Should be 18+

# Clear dependencies
rm -rf node_modules package-lock.json
npm install

# Test local build
npm run build
```

#### 2. CORS Errors
```javascript
// Update backend CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
```

#### 3. Database Connection Issues
```bash
# Verify DATABASE_URL format
postgresql://username:password@host:port/database

# Check connection in Railway/Render logs
console.log('Database connecting to:', process.env.DATABASE_URL?.split('@')[1]);
```

#### 4. Environment Variables Not Loading
```bash
# Frontend: Must start with VITE_
VITE_API_BASE_URL=https://api.example.com

# Backend: Standard environment variables
NODE_ENV=production
JWT_SECRET=secret
```

## 📊 Monitoring & Maintenance

### Performance Monitoring
```javascript
// Add to server.js
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});
```

### Database Backup
```bash
# Railway auto-backups enabled
# Manual backup via Railway CLI:
railway db backup
```

### Log Monitoring
```bash
# Railway logs
railway logs --follow

# Render logs available in dashboard
```

## 💰 Cost Analysis

### Free Tier Limits

#### Netlify
- 100GB bandwidth/month
- 300 build minutes/month
- Unlimited sites

#### Vercel
- 100GB bandwidth/month
- 6000 serverless function executions/day
- Unlimited deployments

#### Railway
- $5 credit/month (covers small apps)
- 750 hours runtime
- 1GB RAM, 1 vCPU

#### Render
- 750 hours/month free
- 512MB RAM
- Auto-sleep after 15min inactivity

## 🔄 Updates & Scaling

### Automated Deployments
1. Push to `main` branch triggers deployment
2. Preview deployments for pull requests
3. Rollback options available

### Scaling Options
1. **Traffic**: Upgrade hosting plans
2. **Database**: Migrate to dedicated PostgreSQL
3. **Performance**: Add Redis caching
4. **Features**: Add background job processing

## 📞 Support Resources

### Platform Documentation
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)

### Community Support
- Railway Discord
- Netlify Community
- Vercel Discord
- Stack Overflow

---

## ✅ Deployment Checklist

### Pre-deployment
- [ ] Code pushed to GitHub
- [ ] Environment variables documented
- [ ] Build process tested locally
- [ ] Database schema finalized

### Frontend Deployment
- [ ] Netlify/Vercel account created
- [ ] Repository connected
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Custom domain configured (optional)

### Backend Deployment
- [ ] Railway/Render account created
- [ ] Database service added
- [ ] Environment variables configured
- [ ] CORS origins updated
- [ ] Health check endpoint tested

### Post-deployment Testing
- [ ] Health checks passing
- [ ] API endpoints working
- [ ] Frontend-backend communication
- [ ] User registration flow
- [ ] Stock data fetching
- [ ] Trading functionality
- [ ] Portfolio calculations

### Monitoring Setup
- [ ] Error logging configured
- [ ] Performance monitoring
- [ ] Automated backups
- [ ] Update procedures documented

---

🎉 **Congratulations!** Your Stocky application is now deployed and ready for users!

*For technical support, create an issue in the GitHub repository.*