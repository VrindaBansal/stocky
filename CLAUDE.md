# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Stocky** is a gamified stock investment learning platform built as a React web application. The app teaches users stock investing through progressive levels, starting with basic concepts and advancing to complex strategies like short selling and options trading. Everything runs client-side with no backend required.

## Architecture & Technology Stack

### Frontend Stack
- **React 18+** with Vite as build tool
- **Redux Toolkit** with RTK Query for state management
- **React Router v6** for navigation
- **Tailwind CSS** for styling
- **Chart.js** with react-chartjs-2 for financial charts
- **Lucide React** for icons
- **Framer Motion** for animations

### Data & Storage
- **Client-side only**: No backend server required
- **localStorage**: All user data, portfolios, and progress stored locally
- **Free APIs**: Yahoo Finance API, Financial Modeling Prep API (250 requests/day), Alpha Vantage API (500 requests/day)

### Key Design Patterns
- **Component-based architecture** with reusable UI components
- **Service layer** for API calls and data management
- **Redux slices** for different feature domains (user, portfolio, market, game)
- **localStorage services** for data persistence

## Color Palette & Branding
- **Primary Dark**: #042A2B (navigation, headers)
- **Primary**: #5EB1BF (primary buttons, active states) 
- **Secondary**: #CDEDF6 (backgrounds, cards)
- **Accent**: #EF7B45 (call-to-action buttons, highlights)
- **Danger/Loss**: #D84727 (losses, warnings, sell actions)

## Game Structure & Levels

The app follows a progressive level system:

1. **Level 1 "Paper Trader"**: $100 starting capital, 5 pre-selected stocks, buy-only
2. **Level 2 "Market Explorer"**: $500 capital, 25 stocks, basic charts and research
3. **Level 3 "Strategic Investor"**: $1,000 capital, 100+ stocks, limit/stop-loss orders
4. **Level 4 "Advanced Trader"**: $5,000 capital, 500+ stocks, short selling, margin simulation
5. **Level 5 "Portfolio Master"**: $10,000 capital, full market access, options simulation

Each level has specific win conditions and unlocks new features progressively.

## Development Commands

Since this is an early-stage repository without a complete setup, these are the planned development commands based on the Vite + React stack:

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install

# Type checking (if TypeScript is added)
npm run typecheck

# Linting (if ESLint is configured)
npm run lint

# Testing (if tests are added)
npm run test
```

## File Structure

```
src/
├── components/
│   ├── charts/          # Financial chart components
│   ├── common/          # Reusable UI components
│   ├── portfolio/       # Portfolio-specific components
│   ├── trading/         # Trading interface components
│   ├── education/       # Learning content components
│   └── layout/          # Layout components
├── pages/               # Route-level components
├── services/            # API services and business logic
├── store/              # Redux store and slices
├── utils/              # Helper functions and utilities
└── styles/             # Global styles
```

## Key Services

- **stockService.js**: Handles all stock market data API calls (Yahoo Finance, FMP, Alpha Vantage)
- **portfolioService.js**: Manages portfolio calculations, transactions, performance tracking
- **storageService.js**: localStorage wrapper for data persistence
- **gameService.js**: Game logic, level progression, achievements

## Important Development Notes

### API Rate Limiting
- Yahoo Finance API is free with no official limits but be respectful
- Financial Modeling Prep: 250 requests/day free tier
- Alpha Vantage: 500 requests/day free tier
- Implement caching to minimize API calls

### Educational Focus
- Always maintain educational disclaimers
- No real money involved - simulation only
- Include "not investment advice" warnings throughout
- Focus on teaching concepts, not encouraging real trading

### Data Persistence Strategy
- Everything stored in browser localStorage
- Each level maintains separate portfolio data
- User progress and achievements tracked across sessions
- Implement export/import functionality for data portability

### Performance Considerations
- Chart components can be expensive - implement proper memoization
- Cache API responses for 1-5 minutes depending on data type
- Lazy load route components for better bundle splitting
- Optimize bundle size since users may have slower connections

## Deployment

The app is designed for static hosting (Netlify, Vercel, GitHub Pages) since it's client-side only. No server configuration needed.

## Educational Content Structure

Learning content should be integrated throughout the app with:
- Interactive tutorials for each new feature
- Contextual tips during trading actions
- Progressive disclosure of concepts matching user's level
- Quizzes and knowledge checks before advancing levels

## Trading Simulation Logic

- Market orders execute at current price
- Limit orders require price validation
- Stop-loss orders trigger when conditions met
- Short selling simulates borrowing costs
- Portfolio value calculated in real-time with live market data

## Achievement System

Gamification elements include:
- Points for successful trades, level completion, educational content consumption
- Badges for specific milestones (first purchase, diversification, risk management, etc.)
- Local leaderboards showing personal bests
- Progress tracking across all levels and features