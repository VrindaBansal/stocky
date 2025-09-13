import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Eye, Building2, Factory, ExternalLink, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import stockService from '../services/stockServiceSimple.js';
import { formatCurrency, formatPercentage, getGainLossColor } from '../utils/helpers.js';

const Market = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trendingStocks, setTrendingStocks] = useState([]);
  const [quotes, setQuotes] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSector, setSelectedSector] = useState(null);
  const [sectorNews, setSectorNews] = useState({});
  const [newsLoading, setNewsLoading] = useState(false);
  const [expandedCompany, setExpandedCompany] = useState(null);

  useEffect(() => {
    loadTrendingStocks();
  }, []);

  // Market data and company information
  const sectorData = {
    'Technology': {
      performance: '+2.4%',
      trend: 'up',
      marketCap: '$15.2T',
      companies: ['AAPL', 'MSFT', 'GOOGL', 'META', 'NVDA', 'ADBE', 'CRM', 'INTC', 'CSCO', 'ORCL'],
      description: 'Leading innovation in software, hardware, and digital services globally.',
      keyThemes: ['Artificial Intelligence', 'Cloud Computing', 'Digital Transformation', 'Cybersecurity']
    },
    'Healthcare': {
      performance: '+1.8%',
      trend: 'up',
      marketCap: '$8.9T',
      companies: ['JNJ', 'PFE', 'ABT', 'TMO', 'LLY', 'MRK', 'UNH'],
      description: 'Pharmaceutical, biotechnology, and medical device companies.',
      keyThemes: ['Drug Development', 'Biotech Innovation', 'Medical Devices', 'Healthcare Services']
    },
    'Financial': {
      performance: '-0.5%',
      trend: 'down',
      marketCap: '$6.7T',
      companies: ['JPM', 'V', 'MA', 'BAC'],
      description: 'Banks, payment processors, and financial services companies.',
      keyThemes: ['Digital Banking', 'Fintech', 'Interest Rates', 'Regulation']
    },
    'Consumer': {
      performance: '+0.9%',
      trend: 'up',
      marketCap: '$5.1T',
      companies: ['AMZN', 'WMT', 'HD', 'DIS', 'NKE', 'COST', 'PG', 'KO', 'PEP'],
      description: 'Retail, entertainment, and consumer goods companies.',
      keyThemes: ['E-commerce Growth', 'Consumer Spending', 'Brand Loyalty', 'Supply Chain']
    },
    'Energy': {
      performance: '+3.2%',
      trend: 'up',
      marketCap: '$2.8T',
      companies: ['XOM'],
      description: 'Oil, gas, and renewable energy companies.',
      keyThemes: ['Energy Transition', 'Oil Prices', 'Renewable Energy', 'ESG Investing']
    },
    'Communication': {
      performance: '+1.1%',
      trend: 'up',
      marketCap: '$3.4T',
      companies: ['NFLX'],
      description: 'Media, entertainment, and telecommunications companies.',
      keyThemes: ['Streaming Wars', '5G Deployment', 'Content Creation', 'Digital Advertising']
    }
  };

  const companyProfiles = {
    'AAPL': {
      name: 'Apple Inc.',
      sector: 'Technology',
      industry: 'Consumer Electronics',
      marketCap: '$3.0T',
      description: 'World\'s largest technology company by revenue, known for iPhone, Mac, and services.',
      headquarters: 'Cupertino, CA',
      employees: '161,000',
      founded: '1976',
      bullishPoints: [
        'Dominant ecosystem with high customer loyalty',
        'Strong services revenue growth (+16% annually)',
        'Massive cash reserves ($165B+) for innovation',
        'Leading position in premium smartphone market',
        'Expanding into new categories (VR/AR, automotive)'
      ],
      bearishPoints: [
        'Heavy dependence on iPhone sales (52% of revenue)',
        'Intense competition in smartphone market',
        'Regulatory pressure and potential antitrust action',
        'Slowing growth in mature markets',
        'Supply chain vulnerabilities in Asia'
      ],
      keyMetrics: {
        'P/E Ratio': '28.5',
        'Revenue Growth': '8.2%',
        'Profit Margin': '25.3%',
        'ROE': '147.4%'
      }
    },
    'MSFT': {
      name: 'Microsoft Corporation',
      sector: 'Technology',
      industry: 'Software',
      marketCap: '$2.8T',
      description: 'Leading software company with cloud computing, productivity software, and gaming.',
      headquarters: 'Redmond, WA',
      employees: '221,000',
      founded: '1975',
      bullishPoints: [
        'Azure cloud platform growing at 25%+ annually',
        'Strong recurring revenue from Office 365 subscriptions',
        'Leadership in AI with OpenAI partnership',
        'Diversified revenue streams across enterprise and consumer',
        'Strong balance sheet and consistent dividend payments'
      ],
      bearishPoints: [
        'Intense competition from Amazon AWS and Google Cloud',
        'Legacy business segments facing slower growth',
        'High valuation relative to historical norms',
        'Regulatory scrutiny over market dominance',
        'Currency headwinds from international operations'
      ],
      keyMetrics: {
        'P/E Ratio': '32.1',
        'Revenue Growth': '12.1%',
        'Profit Margin': '36.7%',
        'ROE': '45.2%'
      }
    },
    'GOOGL': {
      name: 'Alphabet Inc.',
      sector: 'Technology',
      industry: 'Internet Services',
      marketCap: '$1.7T',
      description: 'Parent company of Google, leading in search, advertising, and cloud computing.',
      headquarters: 'Mountain View, CA',
      employees: '182,000',
      founded: '1998',
      bullishPoints: [
        'Dominant search engine with 92% market share',
        'YouTube growth in video advertising and subscriptions',
        'Google Cloud Platform gaining enterprise customers',
        'Leadership in AI research and development',
        'Strong free cash flow generation'
      ],
      bearishPoints: [
        'Heavy dependence on advertising revenue (80%+)',
        'Regulatory pressure and antitrust investigations',
        'Competition from TikTok and other social platforms',
        'Privacy regulations impacting ad targeting',
        'High employee costs and R&D expenses'
      ],
      keyMetrics: {
        'P/E Ratio': '24.8',
        'Revenue Growth': '11.3%',
        'Profit Margin': '21.2%',
        'ROE': '29.1%'
      }
    },
    'TSLA': {
      name: 'Tesla Inc.',
      sector: 'Consumer',
      industry: 'Electric Vehicles',
      marketCap: '$800B',
      description: 'Leading electric vehicle manufacturer and clean energy company.',
      headquarters: 'Austin, TX',
      employees: '127,000',
      founded: '2003',
      bullishPoints: [
        'First-mover advantage in premium EV market',
        'Supercharger network provides competitive moat',
        'Vertical integration reduces costs and improves margins',
        'Energy storage and solar business growth potential',
        'Full self-driving technology development'
      ],
      bearishPoints: [
        'Intense competition from traditional automakers',
        'Production and delivery challenges',
        'High valuation compared to traditional automakers',
        'Regulatory changes affecting EV incentives',
        'Key person risk with CEO Elon Musk'
      ],
      keyMetrics: {
        'P/E Ratio': '65.2',
        'Revenue Growth': '51.4%',
        'Profit Margin': '8.1%',
        'ROE': '28.1%'
      }
    }
  };

  // API service for fetching market news
  const fetchSectorNews = async (sector) => {
    const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
      console.warn('Alpha Vantage API key not found');
      return null;
    }

    // Rate limiting: check if we've already fetched today
    const cacheKey = `sector_news_${sector}_${new Date().toDateString()}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    try {
      setNewsLoading(true);
      const topCompanies = sectorData[sector]?.companies.slice(0, 3).join(',') || 'AAPL,MSFT,GOOGL';
      const response = await fetch(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${topCompanies}&apikey=${apiKey}&limit=5`
      );
      const data = await response.json();
      
      if (data.feed) {
        const processedNews = data.feed.slice(0, 4).map(article => ({
          title: article.title,
          summary: article.summary || article.title.substring(0, 120) + '...',
          url: article.url,
          source: article.source,
          date: new Date(article.time_published).toLocaleDateString(),
          sentiment: article.overall_sentiment_score > 0.1 ? 'positive' : 
                    article.overall_sentiment_score < -0.1 ? 'negative' : 'neutral'
        }));
        
        // Cache the data for 24 hours
        localStorage.setItem(cacheKey, JSON.stringify(processedNews));
        return processedNews;
      }
    } catch (error) {
      console.error('Error fetching sector news:', error);
    } finally {
      setNewsLoading(false);
    }
    return null;
  };

  const loadTrendingStocks = async () => {
    setIsLoading(true);
    try {
      // Show all major stocks
      const allMajorStocks = [
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
        'JPM', 'V', 'JNJ', 'WMT', 'PG', 'HD', 'DIS', 'PYPL', 'ADBE', 'CRM',
        'INTC', 'CSCO', 'PFE', 'KO', 'PEP', 'ABT', 'TMO', 'COST', 'AVGO', 'TXN',
        'ORCL', 'ACN', 'LLY', 'NKE', 'MRK', 'UNH', 'MA', 'BABA', 'XOM', 'BAC'
      ];
      setTrendingStocks(allMajorStocks);
      
      // Load quotes for all stocks
      const quotesData = await stockService.getMultipleQuotes(allMajorStocks);
      setQuotes(quotesData);
    } catch (error) {
      console.error('Error loading stocks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await stockService.searchStocks(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching stocks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectorClick = async (sector) => {
    setSelectedSector(sector);
    if (!sectorNews[sector]) {
      const news = await fetchSectorNews(sector);
      if (news) {
        setSectorNews(prev => ({ ...prev, [sector]: news }));
      }
    }
  };

  const StockCard = ({ symbol, quote, showWatchButton = true }) => {
    if (!quote) return null;

    const company = companyProfiles[symbol];
    const isExpanded = expandedCompany === symbol;

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="card overflow-hidden"
      >
        <div className="p-4">
          <Link to={`/market/${symbol}`} className="block">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {symbol.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{symbol}</h3>
                  <p className="text-sm text-gray-600">{company?.name || 'Stock'}</p>
                </div>
              </div>
              {showWatchButton && (
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <Eye className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-gray-800">
                  {formatCurrency(quote.price)}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${getGainLossColor(quote.change)}`}>
                  {quote.change >= 0 ? '+' : ''}{formatCurrency(quote.change)}
                </p>
                <p className={`text-sm ${getGainLossColor(quote.change)}`}>
                  {quote.changePercent >= 0 ? '+' : ''}{formatPercentage(quote.changePercent / 100)}
                </p>
              </div>
            </div>
          </Link>

          {company && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setExpandedCompany(isExpanded ? null : symbol);
                }}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-sm font-medium text-gray-700">Company Info</span>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-3"
                  >
                    <div className="text-sm">
                      <p className="text-gray-600 mb-2">{company.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="font-medium">Sector:</span> {company.sector}
                        </div>
                        <div>
                          <span className="font-medium">Market Cap:</span> {company.marketCap}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <h4 className="flex items-center text-sm font-semibold text-green-900 mb-2">
                          <span className="text-lg mr-1">🐂</span>
                          Bulls Say
                        </h4>
                        <ul className="text-xs space-y-1">
                          {company.bullishPoints.slice(0, 3).map((point, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                              <span className="text-green-800">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h4 className="flex items-center text-sm font-semibold text-red-900 mb-2">
                          <span className="text-lg mr-1">🐻</span>
                          Bears Say
                        </h4>
                        <ul className="text-xs space-y-1">
                          {company.bearishPoints.slice(0, 3).map((point, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-1 h-1 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                              <span className="text-red-800">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const SectorCard = ({ sectorName, data }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => handleSectorClick(sectorName)}
      className="card p-4 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Factory className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{sectorName}</h3>
            <p className="text-sm text-gray-600">{data.companies.length} companies</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-semibold ${data.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {data.performance}
          </p>
          <p className="text-sm text-gray-500">{data.marketCap}</p>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{data.description}</p>
      
      <div className="flex flex-wrap gap-1">
        {data.keyThemes.map((theme, index) => (
          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {theme}
          </span>
        ))}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Stock Market</h1>
          <p className="text-gray-600">Comprehensive market data, sectors, and company analysis</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Market Overview', icon: BarChart3 },
          { id: 'sectors', label: 'Sectors & Industries', icon: Building2 },
          { id: 'stocks', label: 'All Stocks', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="card p-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search stocks by symbol or company name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-2 max-h-60 overflow-y-auto"
          >
            {searchResults.map((result) => (
              <Link
                key={result.symbol}
                to={`/market/${result.symbol}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-800">{result.symbol}</p>
                  <p className="text-sm text-gray-600">{result.name}</p>
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </Link>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Market Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card p-6 bg-gradient-to-r from-green-50 to-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">Market Status</h3>
                    <p className="text-green-700">
                      {new Date().getHours() >= 9 && new Date().getHours() < 16 ? 'Markets Open' : 'Markets Closed'}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    new Date().getHours() >= 9 && new Date().getHours() < 16 ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-1">Top Gainer</h3>
                <p className="text-green-600 font-bold">+5.2%</p>
                <p className="text-sm text-gray-600">Energy Sector</p>
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-1">Market Cap</h3>
                <p className="text-blue-600 font-bold">$45.8T</p>
                <p className="text-sm text-gray-600">Total Market</p>
              </div>
            </div>

            {/* Top Performers */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performers Today</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['AAPL', 'MSFT', 'GOOGL', 'TSLA'].map((symbol) => (
                  <StockCard key={symbol} symbol={symbol} quote={quotes[symbol]} showWatchButton={false} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'sectors' && (
          <motion.div
            key="sectors"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Sector Overview */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sector Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(sectorData).map(([sector, data]) => (
                  <SectorCard key={sector} sectorName={sector} data={data} />
                ))}
              </div>
            </div>

            {/* Sector Details Modal */}
            <AnimatePresence>
              {selectedSector && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedSector} Sector</h2>
                        <p className="text-gray-600">{sectorData[selectedSector]?.description}</p>
                      </div>
                      <button
                        onClick={() => setSelectedSector(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        ×
                      </button>
                    </div>

                    {/* Sector Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                          {sectorData[selectedSector]?.performance}
                        </p>
                        <p className="text-sm text-blue-800">Performance</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {sectorData[selectedSector]?.marketCap}
                        </p>
                        <p className="text-sm text-green-800">Market Cap</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">
                          {sectorData[selectedSector]?.companies.length}
                        </p>
                        <p className="text-sm text-purple-800">Companies</p>
                      </div>
                    </div>

                    {/* Sector News */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        📰 Latest {selectedSector} News
                        {newsLoading && (
                          <div className="ml-2 w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                        )}
                      </h3>
                      <div className="space-y-3">
                        {(sectorNews[selectedSector] || []).map((news, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                  <h4 className="font-medium text-gray-900 flex-1">{news.title}</h4>
                                  {news.url && (
                                    <a
                                      href={news.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="ml-2 p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </a>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{news.summary}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>{news.source}</span>
                                  <span>•</span>
                                  <span>{news.date}</span>
                                </div>
                              </div>
                              <div className={`px-2 py-1 rounded text-xs font-medium ml-4 ${
                                news.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                                news.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {news.sentiment}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Companies in Sector */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Companies</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sectorData[selectedSector]?.companies.slice(0, 6).map((symbol) => (
                          <StockCard key={symbol} symbol={symbol} quote={quotes[symbol]} showWatchButton={false} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {activeTab === 'stocks' && (
          <motion.div
            key="stocks"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* All Stocks */}
            <div className="card p-6">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-bold text-gray-900">All Available Stocks</h2>
                <span className="text-sm text-gray-500">({trendingStocks.length} stocks)</span>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 rounded-xl h-32"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trendingStocks.map((symbol, index) => (
                    <motion.div
                      key={symbol}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <StockCard symbol={symbol} quote={quotes[symbol]} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Market;