# 🚀 Stocky Deployment Guide

This guide covers deploying Stocky to production with email integration and user progress tracking.

## 📋 Overview

**Frontend:** Deployed to Netlify  
**Backend:** Deployed to Railway (free tier with email integration)  
**Database:** PostgreSQL (Railway provides this)  
**Email Integration:** Built into backend authentication system  

## 🔧 Backend Deployment (Railway)

### Step 1: Deploy Backend to Railway

1. **Create Railway Account**
   ```bash
   # Visit railway.app and sign up with GitHub
   ```

2. **Connect Backend Repository**
   - Connect your stocky-backend repository to Railway
   - Railway will auto-detect it's a Node.js project

3. **Set Environment Variables in Railway Dashboard**
   ```bash
   NODE_ENV=production
   JWT_SECRET=your_super_secure_jwt_secret_for_production_change_this
   JWT_EXPIRE=7d
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
   CORS_ORIGIN=https://your-app.netlify.app,https://stocky-game.netlify.app
   RATE_LIMIT_WINDOW=15
   RATE_LIMIT_MAX=100
   PORT=8080
   ```

4. **Database Setup**
   - Railway automatically provisions PostgreSQL
   - DATABASE_URL is automatically set by Railway
   - Run database migrations after deployment:
   ```bash
   railway run npm run migrate
   ```

5. **Note Your Backend URL**
   - Railway will provide a URL like: `https://stocky-backend-production.up.railway.app`
   - You'll need this for frontend configuration

### Step 2: Backend Features ✅

Your backend already includes:
- ✅ **User Registration with Email** - Users register with real email addresses
- ✅ **Secure Authentication** - JWT tokens with bcrypt password hashing
- ✅ **User Progress Tracking** - All trades, levels, and achievements tracked
- ✅ **Portfolio Management** - Multi-level portfolios with transaction history
- ✅ **Data Persistence** - PostgreSQL database with full ACID compliance
- ✅ **Security** - Rate limiting, CORS, input validation, SQL injection protection
- ✅ **Real Stock Data** - Alpha Vantage integration for live market data

## 🎨 Frontend Deployment (Netlify)

### Step 1: Environment Configuration

Create `.env.production` in your stocky frontend folder:
```bash
VITE_API_BASE_URL=https://your-railway-backend-url.up.railway.app/api
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
```

### Step 2: Update Netlify Configuration

Your `netlify.toml` is already configured. Just ensure environment variables are set in Netlify dashboard:

1. **Netlify Dashboard > Site Settings > Environment Variables**
   ```bash
   VITE_API_BASE_URL=https://your-railway-backend-url.up.railway.app/api
   VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
   ```

### Step 3: Deploy to Netlify

```bash
# Build and deploy
npm run build

# Or connect your GitHub repo to Netlify for auto-deploy
```

## 👤 User Experience Flow

### New User Registration
1. User visits your Netlify site
2. Goes through 4-step onboarding (already implemented)
3. **Registers with real email address** ✅
4. Backend creates user account with email in PostgreSQL
5. User gets JWT token for authentication
6. **User progress is now permanently stored** ✅

### Returning User Experience
1. User visits site
2. App automatically authenticates via stored JWT
3. **All progress loads from database** (levels, trades, achievements)
4. User can continue their stock trading journey

### Game Progress Tracking ✅
- ✅ **All trades tracked** - Buy/sell transactions with timestamps
- ✅ **Level progression** - Automatic level advancement based on portfolio value
- ✅ **Achievement system** - Points, streaks, successful trades tracked
- ✅ **Portfolio history** - Complete transaction log per user
- ✅ **User statistics** - Total return, win rate, days active, etc.

## 🔒 Email Integration Details

### User Registration Process
```javascript
// Backend /api/auth/register endpoint
{
  "username": "player123",
  "email": "user@example.com",    // ✅ Real email required
  "password": "securepass123",
  "avatar": "bull"
}
```

### Database Schema (Already Created)
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,     -- ✅ Email stored
  password_hash TEXT NOT NULL,
  avatar VARCHAR(20) DEFAULT 'default',
  current_level INTEGER DEFAULT 1,
  total_points INTEGER DEFAULT 0,
  preferences JSONB,
  stats JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);
```

## 📊 Production-Ready Features

### ✅ Already Implemented
- **Security**: Helmet, CORS, rate limiting, input validation
- **Authentication**: JWT with secure password hashing
- **Database**: Production PostgreSQL with connection pooling
- **Error Handling**: Comprehensive error responses
- **Logging**: Request/response logging with Morgan
- **Health Checks**: `/health` endpoint for monitoring
- **Stock Data**: Real-time stock quotes via Alpha Vantage
- **CORS**: Configured for your domain
- **Environment Config**: Production vs development settings

### 📈 Monitoring & Scaling
- **Railway Dashboard**: Monitor CPU, memory, requests
- **Database Monitoring**: Query performance and connections
- **Error Tracking**: Built-in error logging
- **Auto-scaling**: Railway handles traffic spikes

## 🚀 Quick Deploy Checklist

### Backend (Railway)
- [ ] Create Railway account
- [ ] Connect stocky-backend repo
- [ ] Set environment variables
- [ ] Deploy and note backend URL
- [ ] Run database migrations

### Frontend (Netlify)
- [ ] Set VITE_API_BASE_URL to Railway backend URL
- [ ] Set environment variables in Netlify dashboard
- [ ] Deploy frontend
- [ ] Test registration with real email

### Testing
- [ ] Visit your Netlify URL
- [ ] Complete onboarding with real email
- [ ] Make a trade in Level 1
- [ ] Refresh page - progress should persist ✅
- [ ] Register another user - should work independently ✅

## 🎯 User Acquisition Ready

Your app is now ready for real users:
- ✅ **Real email registration** - Users sign up with actual emails
- ✅ **Persistent progress** - All data saved to production database
- ✅ **Secure authentication** - Industry-standard security
- ✅ **Scalable infrastructure** - Railway handles traffic growth
- ✅ **Game mechanics** - 5 levels with increasing complexity
- ✅ **Trading simulation** - Real market data integration

## 📧 Support & Maintenance

### Database Backups
Railway automatically backs up PostgreSQL daily.

### Monitoring
- Railway dashboard for backend metrics
- Netlify analytics for frontend usage
- Built-in error logging captures issues

### Updates
- Push to main branch → auto-deploy to production
- Database migrations run with `railway run npm run migrate`

---

**🎮 Your gamified stock trading platform is now production-ready with email integration and full user progress tracking!**