# 📈 Stocky - Your Stock Learning Game

![Stocky Logo](./public/stocky-icon.svg)

**Stocky** is a gamified stock investment learning platform built with React. Learn the fundamentals of stock trading through interactive gameplay, progressing through 5 exciting levels with virtual money and real market concepts.

## 🚀 Features

### 🆕 Recent Improvements (v1.0.1)
- **Enhanced Dashboard**: Vertical level progression with visual timeline
- **Improved Education Center**: Complete markdown-based lessons with interactive content
- **Tutorial Integration**: Smart tutorial system that launches from dashboard
- **Optimized Performance**: Code-split builds with <300KB chunks
- **Production Ready**: Netlify deployment with zero configuration

### 🎮 Gamified Learning Experience
- **5 Progressive Levels**: From Paper Trader to Portfolio Master
- **Achievement System**: Unlock badges and earn points
- **Virtual Trading**: Practice with fake money, real concepts
- **Interactive Tutorials**: Learn as you play

### 💹 Trading Features
- **Real-time Stock Quotes**: Using Yahoo Finance, FMP, and Alpha Vantage APIs
- **Multiple Order Types**: Market orders, limit orders, stop-loss
- **Portfolio Management**: Track performance and diversification
- **Short Selling**: Advanced trading strategies (Level 4+)

### 🎨 Beautiful Design
- **Modern UI**: Tailwind CSS with custom animations
- **Responsive Design**: Works on desktop and mobile
- **Smooth Animations**: Framer Motion for delightful interactions
- **Dark/Light Themes**: Coming soon

## 🎯 Learning Progression

| Level | Name | Starting Capital | Win Condition | Focus |
|-------|------|-----------------|---------------|-------|
| 1 | Paper Trader | $200 | $240 (20% gain) | Basic buy/sell |
| 2 | Market Explorer | $500 | $600 (20% gain) | Market research & sectors |
| 3 | Strategic Investor | $1,000 | $1,300 (30% gain) | Advanced orders & risk management |
| 4 | Advanced Trader | $5,000 | $6,500 (30% gain) | Short selling & margin |
| 5 | Portfolio Master | $10,000 | $15,000 (50% gain) | Options & portfolio theory |

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Chart.js
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Storage**: LocalStorage (no backend needed!)

## 📊 APIs Used

- **Yahoo Finance API** (Primary - Free, no limits)
- **Financial Modeling Prep API** (250 requests/day free)
- **Alpha Vantage API** (500 requests/day free)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stocky.git
   cd stocky
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   # Create .env.local file
   VITE_ALPHA_VANTAGE_API_KEY=your_key_here
   VITE_FMP_API_KEY=your_fmp_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🌐 Deployment

### Netlify (Recommended)
Ready for one-click deployment! The project includes optimized configuration:

1. **Connect GitHub repository** to Netlify
2. **Build settings** (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 20
3. **Environment variables** (optional):
   ```
   VITE_ALPHA_VANTAGE_API_KEY=your_key_here
   VITE_FMP_API_KEY=your_key_here
   ```
4. **Deploy!** - Automatic deployments on every push

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/stocky)

### Build Optimizations
- ✅ Code splitting for optimal loading
- ✅ Chunk size optimization (< 300KB per chunk)
- ✅ React Router redirects configured
- ✅ Production-ready Vite configuration

### Vercel
1. Connect repository to Vercel
2. Auto-detected React settings work perfectly
3. Add environment variables if needed
4. Deploy with zero configuration!

## 🎓 Educational Disclaimers

**⚠️ IMPORTANT: This is for educational purposes only**

- All trading is simulated with virtual money
- No real money is involved
- Market data may be delayed or simulated
- Not investment advice - consult professionals for real trading
- Past performance does not predict future results

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── charts/         # Chart components
│   ├── common/         # Common UI elements
│   ├── layout/         # Layout components
│   ├── portfolio/      # Portfolio-specific components
│   └── trading/        # Trading interface components
├── pages/              # Route-level components
├── services/           # API services and business logic
├── store/              # Redux store and slices
├── styles/             # Global styles and Tailwind config
└── utils/              # Helper functions and constants
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Yahoo Finance](https://finance.yahoo.com/) for free stock data
- [Financial Modeling Prep](https://financialmodelingprep.com/) for additional market data
- [Alpha Vantage](https://www.alphavantage.co/) for backup stock data
- [Tailwind CSS](https://tailwindcss.com/) for the amazing utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

## 📞 Support

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/stocky/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/stocky/discussions)

---

**Happy Trading! 🎉📈**

*Remember: This is a learning game. Always consult financial professionals before making real investment decisions.*

