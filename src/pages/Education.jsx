import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Target, Award, TrendingUp, X, CheckCircle, ExternalLink } from 'lucide-react';

const Education = () => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [newsData, setNewsData] = useState({});
  const [newsLoading, setNewsLoading] = useState(false);
  
  // API service for fetching market news
  const fetchMarketNews = async (lessonId) => {
    const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
      console.warn('Alpha Vantage API key not found');
      return null;
    }

    // Rate limiting: check if we've already fetched today
    const cacheKey = `news_${lessonId}_${new Date().toDateString()}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    try {
      setNewsLoading(true);
      const response = await fetch(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL,MSFT,GOOGL&apikey=${apiKey}&limit=10`
      );
      const data = await response.json();
      
      if (data.feed) {
        const processedNews = data.feed.slice(0, 3).map(article => ({
          title: article.title,
          summary: article.summary || article.title,
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
      console.error('Error fetching news:', error);
    } finally {
      setNewsLoading(false);
    }
    return null;
  };

  // Load news when lesson is selected
  useEffect(() => {
    if (selectedLesson && !quizMode) {
      const loadNews = async () => {
        const news = await fetchMarketNews(selectedLesson.id);
        if (news) {
          setNewsData(prev => ({ ...prev, [selectedLesson.id]: news }));
        }
      };
      
      if (!newsData[selectedLesson.id]) {
        loadNews();
      }
    }
  }, [selectedLesson, quizMode]);

  // Quiz functionality
  const startQuiz = (lesson) => {
    setSelectedLesson(lesson);
    setQuizMode(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setQuizScore(0);
  };

  const selectAnswer = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const submitQuiz = () => {
    const quiz = selectedLesson.quiz;
    let score = 0;
    quiz.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizCompleted(true);
    
    // Mark lesson as completed if they get 100%
    if (score === quiz.length) {
      // In a real app, this would update the lesson completion status in state/database
      selectedLesson.completed = true;
    }
  };

  const resetQuiz = () => {
    setQuizMode(false);
    setSelectedLesson(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setQuizScore(0);
  };

  // Helper functions for enhanced content sections
  const getKeyTakeaways = (lessonId) => {
    const takeaways = {
      1: [
        "A stock represents partial ownership in a company",
        "Market cap = Share Price × Total Shares Outstanding",
        "Common stock provides voting rights, preferred stock prioritizes dividends",
        "Investors profit through capital appreciation and dividend payments",
        "IPOs allow private companies to raise capital from public investors"
      ],
      2: [
        "Primary markets are where stocks are first issued, secondary markets are where they're traded",
        "Market orders guarantee execution, limit orders guarantee price",
        "Stock prices are driven by supply and demand fundamentals",
        "The S&P 500 best represents the overall U.S. stock market",
        "Brokers provide access to exchanges, which you cannot trade on directly"
      ],
      3: [
        "Candlestick charts provide the most comprehensive price information",
        "Head and Shoulders patterns often signal trend reversals",
        "RSI measures momentum and helps identify overbought/oversold conditions",
        "Moving averages smooth out price data to identify trends",
        "MACD combines trend-following and momentum indicators"
      ],
      4: [
        "Stop-loss orders automatically limit losses at predetermined levels",
        "Position sizing determines how much capital to risk per trade",
        "Diversification reduces portfolio risk by spreading investments",
        "Risk-reward ratios help evaluate trade attractiveness before entering",
        "Emotional discipline is crucial for consistent risk management"
      ],
      5: [
        "Short selling allows profits when stock prices decline",
        "Unlimited loss potential makes short selling high-risk",
        "Short squeezes can cause rapid price increases and force covering",
        "Margin requirements provide collateral for borrowed shares",
        "Short selling can hedge long positions during market downturns"
      ]
    };
    return takeaways[lessonId] || [];
  };

  const getBullishPoints = (lessonId) => {
    const bullish = {
      1: [
        "Stock ownership provides unlimited upside potential as companies grow",
        "Dividend-paying stocks offer passive income streams",
        "Stocks historically outperform bonds and savings accounts long-term",
        "Public markets provide excellent liquidity for buying/selling"
      ],
      2: [
        "Modern markets offer 24/7 global access to investment opportunities",
        "Electronic trading has reduced costs and improved execution speed",
        "Market regulations protect retail investors from fraud",
        "Index funds make diversification accessible to everyone"
      ],
      3: [
        "Technical analysis helps identify optimal entry and exit points",
        "Chart patterns repeat due to consistent human psychology",
        "Multiple timeframes provide comprehensive market perspective",
        "Technical indicators can confirm fundamental analysis signals"
      ],
      4: [
        "Proper risk management allows for sustainable long-term trading",
        "Stop-losses prevent small losses from becoming catastrophic",
        "Position sizing enables consistent profitability over time",
        "Diversification reduces single-stock concentration risk"
      ],
      5: [
        "Short selling provides profit opportunities in declining markets",
        "Can hedge existing long positions during market downturns",
        "Allows sophisticated portfolio strategies and market-neutral approaches",
        "Helps with price discovery and market efficiency"
      ]
    };
    return bullish[lessonId] || [];
  };

  const getBearishPoints = (lessonId) => {
    const bearish = {
      1: [
        "Stock prices can be extremely volatile and unpredictable",
        "Company bankruptcies can lead to total loss of investment",
        "Dividend payments are not guaranteed and can be suspended",
        "Individual stock picking requires significant research and expertise"
      ],
      2: [
        "High-frequency trading can disadvantage retail investors",
        "Market crashes can wipe out decades of gains quickly",
        "Complex financial products can mislead inexperienced investors",
        "Market manipulation by large institutions remains a concern"
      ],
      3: [
        "Technical analysis can produce false signals and whipsaws",
        "Past price patterns don't guarantee future performance",
        "Over-reliance on indicators can lead to analysis paralysis",
        "Market fundamentals can override technical signals unexpectedly"
      ],
      4: [
        "Strict risk management can limit potential profits",
        "Stop-losses can be triggered by temporary price spikes",
        "Over-diversification can lead to mediocre returns",
        "Risk management rules can prevent catching major trends"
      ],
      5: [
        "Unlimited loss potential makes short selling extremely risky",
        "Short squeezes can force covering at significant losses",
        "Margin calls can force liquidation at worst possible times",
        "Borrowing costs and fees reduce profit potential"
      ]
    };
    return bearish[lessonId] || [];
  };

  const getRecentNews = (lessonId) => {
    // Return real API data if available, otherwise fallback to static data
    if (newsData[lessonId]) {
      return newsData[lessonId];
    }
    
    const fallbackNews = {
      1: [
        {
          title: "Record Number of IPOs in Tech Sector",
          summary: "Technology companies continue to dominate new public offerings, with AI and biotech leading the way.",
          source: "Market Watch",
          date: "2 days ago",
          sentiment: "positive",
          url: "https://www.marketwatch.com/story/ipo-tech-surge-2024"
        },
        {
          title: "Dividend Cuts Across Energy Sector",
          summary: "Traditional energy companies reduce dividend payouts amid transition to renewable sources.",
          source: "Financial Times",
          date: "1 week ago", 
          sentiment: "negative",
          url: "https://www.ft.com/content/energy-dividend-cuts"
        }
      ],
      2: [
        {
          title: "NYSE Trading Volume Hits New Records",
          summary: "Retail investor participation drives unprecedented trading volumes on major exchanges.",
          source: "Bloomberg",
          date: "3 days ago",
          sentiment: "positive",
          url: "https://www.bloomberg.com/news/articles/nyse-volume-records"
        },
        {
          title: "SEC Proposes New Market Structure Rules",
          summary: "Regulators aim to improve price discovery and reduce payment for order flow practices.",
          source: "Reuters",
          date: "1 week ago",
          sentiment: "neutral",
          url: "https://www.reuters.com/business/finance/sec-market-rules"
        }
      ],
      3: [
        {
          title: "Technical Analysis Gains Popularity Among Retail Traders",
          summary: "Chart patterns and technical indicators increasingly guide investment decisions as more platforms offer advanced tools.",
          source: "Wall Street Journal",
          date: "4 days ago",
          sentiment: "positive",
          url: "https://www.wsj.com/articles/technical-analysis-retail-traders"
        },
        {
          title: "AI-Powered Trading Algorithms Challenge Traditional Chart Reading",
          summary: "Machine learning systems process market data faster than human technical analysts, raising questions about pattern reliability.",
          source: "Financial News",
          date: "1 week ago",
          sentiment: "neutral",
          url: "https://www.fnlondon.com/articles/ai-trading-technical-analysis"
        }
      ],
      4: [
        {
          title: "Risk Management Software Adoption Surges Among Day Traders",
          summary: "Automated stop-loss and position sizing tools help retail investors manage portfolio risk more effectively.",
          source: "TradingView News",
          date: "5 days ago",
          sentiment: "positive",
          url: "https://www.tradingview.com/news/risk-management-tools"
        },
        {
          title: "Market Volatility Tests Investor Risk Tolerance",
          summary: "Recent market swings highlight the importance of proper risk management strategies for all investor types.",
          source: "CNBC",
          date: "3 days ago",
          sentiment: "negative",
          url: "https://www.cnbc.com/market-volatility-risk-management"
        }
      ],
      5: [
        {
          title: "Short Interest Reaches Multi-Year Highs in Tech Stocks",
          summary: "Hedge funds and institutional investors increase short positions in overvalued technology companies.",
          source: "MarketWatch",
          date: "2 days ago",
          sentiment: "negative",
          url: "https://www.marketwatch.com/story/tech-short-interest-highs"
        },
        {
          title: "Short Squeeze Alert Systems Gain Traction Among Retail Investors",
          summary: "New tools help traders identify potential short squeeze opportunities in heavily shorted stocks.",
          source: "Benzinga",
          date: "6 days ago",
          sentiment: "positive",
          url: "https://www.benzinga.com/short-squeeze-tools"
        }
      ]
    };
    return fallbackNews[lessonId] || [];
  };

  const lessons = [
    {
      id: 1,
      title: 'What is a Stock?',
      description: 'Understanding the Building Blocks of the Market',
      difficulty: 'Beginner',
      duration: '15 min',
      completed: false,
      icon: '🏢',
      content: `
        <h2>What is a Stock?</h2>
        <h3>Understanding the Building Blocks of the Market</h3>
        
        <p><strong>What Exactly is a Stock?</strong></p>
        <p>Imagine a successful local pizza shop wants to expand into a national chain. This will cost millions of dollars. Instead of just getting a bank loan, the owners decide to divide the entire business into one million "slices" and sell them to the public. A <strong>stock</strong> (also called a "share" or "equity") is simply one of those slices.</p>
        
        <p>When you buy a stock, you are purchasing a small piece of ownership in that company. You become a <strong>shareholder</strong>, which means you are now a part-owner of the business, its brand, its buildings, and its potential for future profits. If the pizza chain becomes a huge success, the value of your slice—your stock—can increase significantly. Conversely, if the business performs poorly, the value of your slice can decrease. Your fortune is now tied to the company's success.</p>
        
        <p><strong>From Private to Public: Why Companies Sell Stock</strong></p>
        <p>Companies sell stock to raise <strong>capital</strong> (money) to fuel growth. Before selling shares to the public, a company is considered <strong>private</strong>, owned by its founders, early investors, and employees. When it wants to access a much larger pool of capital, it can go through a process called an <strong>Initial Public Offering (IPO)</strong>. This is the first time the company's stock is offered for sale on a public exchange, like the NYSE or NASDAQ.</p>
        
        <p>Once public, the company's value can be easily measured by its <strong>market capitalization</strong> (or "market cap"), which is calculated by a simple formula:</p>
        <p><code>Market Capitalization = Current Share Price × Total Number of Shares</code></p>
        <p>A company with 100 million shares trading at $50 per share has a market cap of $5 billion. This figure is a primary measure of a company's size and value in the public eye.</p>
        
        <p><strong>The Different Flavors of Stock</strong></p>
        <p>Not all stocks are created equal. While there are two main types, the details can vary.</p>
        <ol>
          <li><strong>Common Stock:</strong> This is what most people mean when they talk about stocks. It grants the holder ownership and, crucially, <strong>voting rights</strong>. Shareholders can vote on major corporate actions, such as electing the board of directors or approving mergers. Some companies issue different classes of common stock (e.g., Class A, Class B) with different voting powers, often to allow founders to retain control while raising capital.</li>
          <li><strong>Preferred Stock:</strong> This type is a hybrid between a stock and a bond. Preferred shareholders generally have no voting rights. However, they have a higher claim on the company's assets. This means they are prioritized for <strong>dividend</strong> payments. If a company must suspend its dividend, it must first stop paying common shareholders. If the company goes bankrupt, preferred shareholders are paid back before common shareholders (though after bondholders).</li>
        </ol>
        
        <p><strong>How You Make Money from Stocks</strong></p>
        <p>Investors profit from stocks in two primary ways:</p>
        <ul>
          <li><strong>Capital Appreciation:</strong> This is the most common goal. It's the increase in the stock's market price. If you buy 100 shares of a company at $20 each (a $2,000 investment) and sell them a year later at $25 each (for $2,500), your capital gain is $500.</li>
          <li><strong>Dividends:</strong> Many stable, established companies choose to distribute a portion of their profits to shareholders. These payments, called dividends, are a direct return on your investment. A stock's <strong>dividend yield</strong> is a percentage that shows how much a company pays in dividends each year relative to its stock price. A $100 stock that pays $3 in annual dividends has a 3% yield.</li>
        </ul>
        
        <p><strong>Conclusion</strong></p>
        <p>A stock represents a direct stake in a business's future. It allows companies to grow and gives investors the opportunity to build wealth by sharing in that growth. Understanding that you are buying a piece of a real company—not just a ticker symbol on a screen—is the most important mindset for a successful investor.</p>
      `,
      quiz: [
        {
          question: "What does buying a stock make you?",
          options: ["A creditor to the company", "A part-owner of the company", "An employee of the company", "A customer of the company"],
          correct: 1
        },
        {
          question: "What is an IPO?",
          options: ["Initial Portfolio Offering", "Initial Public Offering", "Internal Profit Organization", "International Partnership Option"],
          correct: 1
        },
        {
          question: "How is market capitalization calculated?",
          options: ["Share Price ÷ Number of Shares", "Share Price + Number of Shares", "Share Price × Number of Shares", "Share Price - Number of Shares"],
          correct: 2
        },
        {
          question: "Which type of stock typically comes with voting rights?",
          options: ["Preferred Stock", "Common Stock", "Both types equally", "Neither type"],
          correct: 1
        },
        {
          question: "What are the two main ways investors profit from stocks?",
          options: ["Dividends and interest", "Capital appreciation and salaries", "Capital appreciation and dividends", "Interest and bonuses"],
          correct: 2
        }
      ]
    },
    {
      id: 2,
      title: 'How Stock Markets Work',
      description: 'The Engine of the Economy: A Look Inside the Market',
      difficulty: 'Beginner',
      duration: '20 min',
      completed: false,
      icon: '📈',
      content: `
        <h2>How Stock Markets Work</h2>
        <h3>The Engine of the Economy: A Look Inside the Market</h3>
        
        <p><strong>What is a Stock Market?</strong></p>
        <p>The stock market is not a single entity but a vast, interconnected network of exchanges where company shares are traded. Think of it as a global supermarket for stocks. Its two main functions are to provide <strong>liquidity</strong> (the ability to easily buy or sell shares) and facilitate <strong>price discovery</strong> (determining a stock's value through the continuous interaction of buyers and sellers).</p>
        
        <p>A crucial distinction to understand is the difference between the primary and secondary markets:</p>
        <ul>
          <li><strong>The Primary Market:</strong> This is where stocks are born. When a company holds an IPO, it sells its shares <em>directly</em> to investors for the first time. The money from this sale goes to the company.</li>
          <li><strong>The Secondary Market:</strong> This is what we typically refer to as "the stock market." It's where investors trade those previously issued shares <em>amongst themselves</em>. The company is not directly involved in these transactions. The vast majority of all trading happens on the secondary market.</li>
        </ul>
        
        <p><strong>The Key Players and Their Roles</strong></p>
        <ul>
          <li><strong>Companies (Issuers):</strong> Businesses that sell stock to the public to fund operations and growth.</li>
          <li><strong>Investors:</strong> This includes retail investors (individuals like you) and institutional investors (large entities like pension funds, mutual funds, and hedge funds that manage huge sums of money).</li>
          <li><strong>Stock Exchanges:</strong> Formal marketplaces like the NYSE and NASDAQ that enforce rules and use powerful technology to match buy and sell orders in fractions of a second.</li>
          <li><strong>Brokers:</strong> The licensed intermediaries that provide individuals and institutions with access to the stock exchanges. You cannot trade directly on an exchange; you need a brokerage account.</li>
          <li><strong>Regulators:</strong> Government agencies, like the U.S. Securities and Exchange Commission (SEC), that oversee the market to protect investors, prevent fraud, and ensure fair and orderly operation.</li>
        </ul>
        
        <p><strong>Placing an Order: The Mechanics of a Trade</strong></p>
        <p>When you decide to buy or sell a stock, you don't just say "buy!" You place a specific type of order:</p>
        <ul>
          <li><strong>Market Order:</strong> This is the simplest order. It instructs your broker to buy or sell shares <em>immediately</em> at the best available current price. It guarantees your order will be filled quickly, but it does not guarantee the price.</li>
          <li><strong>Limit Order:</strong> This order gives you control over the price. It instructs your broker to buy or sell shares only at a specific price <em>or better</em>. For example, a "buy limit" order at $50 means you will only buy the stock if it is trading at $50 or lower. This guarantees your price but does not guarantee the order will be filled.</li>
        </ul>
        
        <p><strong>What Really Makes Stock Prices Move?</strong></p>
        <p>The price of any stock is constantly fluctuating based on the law of <strong>supply and demand</strong>. Factors that influence this balance include:</p>
        <ul>
          <li><strong>Company Fundamentals:</strong> Earnings reports are paramount. A company reporting higher-than-expected profits will see a surge in demand, pushing the price up. Conversely, a weak report can cause a sell-off.</li>
          <li><strong>Economic Data:</strong> Broader economic news like inflation rates, interest rate changes by the central bank (the Fed), and unemployment figures affect investor confidence and the entire market's direction.</li>
          <li><strong>Industry Trends & News:</strong> Innovations, regulatory changes, or shifting consumer preferences within a specific sector can cause all stocks in that industry to move in tandem.</li>
          <li><strong>Geopolitical Events & Sentiment:</strong> Major world events, political instability, and general market fear or greed can cause widespread buying or selling regardless of individual company performance.</li>
        </ul>
        
        <p><strong>How We Measure the Market: Stock Indexes</strong></p>
        <p>It's impossible to track every single stock. Instead, we use <strong>stock indexes</strong> to gauge the overall health and performance of the market. An index is a curated basket of stocks that represents a portion of the market. The three most-watched indexes in the U.S. are:</p>
        <ul>
          <li><strong>The S&P 500:</strong> Tracks the performance of 500 of the largest U.S. companies. It's considered the best representation of the overall U.S. market.</li>
          <li><strong>The Dow Jones Industrial Average (DJIA):</strong> A price-weighted index of 30 large, well-known "blue-chip" companies.</li>
          <li><strong>The NASDAQ Composite:</strong> Tracks over 3,000 stocks listed on the NASDAQ exchange, with a heavy concentration in the technology sector.</li>
        </ul>
        
        <p><strong>Conclusion</strong></p>
        <p>The stock market is a complex but not incomprehensible system. It's a dynamic arena where information, economics, and human psychology collide to set the value of the world's largest companies. Understanding its structure, from order types to market indexes, provides the context needed to participate intelligently.</p>
      `,
      quiz: [
        {
          question: "What is the difference between primary and secondary markets?",
          options: ["Primary is where stocks are first issued, secondary is where they are traded between investors", "Primary is for small companies, secondary is for large companies", "Primary is morning trading, secondary is afternoon trading", "There is no difference"],
          correct: 0
        },
        {
          question: "What does a market order guarantee?",
          options: ["The exact price you want", "Your order will be filled", "The best possible price", "Nothing is guaranteed"],
          correct: 1
        },
        {
          question: "Which index is considered the best representation of the overall U.S. market?",
          options: ["Dow Jones Industrial Average", "NASDAQ Composite", "S&P 500", "Russell 2000"],
          correct: 2
        },
        {
          question: "What is the primary function of stock exchanges?",
          options: ["To issue new stocks", "To provide liquidity and price discovery", "To regulate companies", "To provide investment advice"],
          correct: 1
        },
        {
          question: "What fundamentally drives stock prices?",
          options: ["Government regulations", "Supply and demand", "Company size", "Time of day"],
          correct: 1
        }
      ]
    },
    {
      id: 3,
      title: 'Reading Stock Charts',
      description: 'Master the art of technical analysis and chart patterns',
      difficulty: 'Intermediate',
      duration: '20 min',
      completed: false,
      icon: '📈',
      content: `
        <h2>Reading Stock Charts</h2>
        <h3>Master the art of technical analysis and chart patterns</h3>
        
        <p>Reading stock charts is a key part of technical analysis. It allows traders to understand market behavior, spot patterns, and make educated guesses about future price movements.</p>
        
        <h3>Types of Charts</h3>
        <ul>
          <li><strong>Line Chart:</strong> Simplest, showing closing prices over time.</li>
          <li><strong>Bar Chart:</strong> Adds highs and lows.</li>
          <li><strong>Candlestick Chart:</strong> Most popular; shows open, high, low, and close.</li>
        </ul>
        
        <h3>Important Patterns to Know</h3>
        <ul>
          <li><strong>Head and Shoulders:</strong> Potential reversal pattern.</li>
          <li><strong>Double Top/Bottom:</strong> Reversal indicators.</li>
          <li><strong>Triangles (Ascending/Descending/Symmetric):</strong> Continuation patterns.</li>
        </ul>
        
        <h3>Technical Indicators</h3>
        <ul>
          <li><strong>Moving Averages</strong> (e.g. 50-day, 200-day)</li>
          <li><strong>RSI (Relative Strength Index):</strong> Measures momentum.</li>
          <li><strong>MACD (Moving Average Convergence Divergence):</strong> Trend-following indicator.</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Learning to read charts empowers traders to make better decisions. With practice, you'll begin to see the market's story unfold visually.</p>
      `,
      quiz: [
        {
          question: "What type of chart shows open, high, low, and close prices?",
          options: ["Line Chart", "Bar Chart", "Candlestick Chart", "Pie Chart"],
          correct: 2
        },
        {
          question: "What does a Head and Shoulders pattern typically indicate?",
          options: ["Continuation of trend", "Potential reversal", "Strong momentum", "High volume"],
          correct: 1
        },
        {
          question: "What does RSI measure?",
          options: ["Volume", "Price direction", "Momentum", "Market cap"],
          correct: 2
        },
        {
          question: "Which moving averages are commonly used by traders?",
          options: ["10-day and 30-day", "50-day and 200-day", "100-day and 300-day", "25-day and 75-day"],
          correct: 1
        },
        {
          question: "What is MACD primarily used for?",
          options: ["Volume analysis", "Trend following", "Price prediction", "Risk management"],
          correct: 1
        }
      ]
    },
    {
      id: 4,
      title: 'Risk Management',
      description: 'Learn how to manage risk and protect your investments',
      difficulty: 'Intermediate',
      duration: '18 min',
      completed: false,
      icon: '🛡️',
      content: `
        <h2>Risk Management</h2>
        <h3>Learn how to manage risk and protect your investments</h3>
        
        <p>Risk management is the cornerstone of sustainable investing. Even the best strategies fail without proper risk controls.</p>
        
        <h3>Common Risks in Trading</h3>
        <ul>
          <li><strong>Market Risk:</strong> Price movement.</li>
          <li><strong>Liquidity Risk:</strong> Inability to exit positions.</li>
          <li><strong>Emotional Risk:</strong> Fear and greed-driven decisions.</li>
        </ul>
        
        <h3>Key Strategies</h3>
        <ul>
          <li><strong>Stop-Loss Orders:</strong> Automatically sell at a set price to limit loss.</li>
          <li><strong>Position Sizing:</strong> Allocate only a percentage of your capital.</li>
          <li><strong>Diversification:</strong> Spread investments to reduce exposure.</li>
        </ul>
        
        <h3>Risk-Reward Ratio</h3>
        <p>Always assess how much you're willing to lose versus how much you can gain. A 1:3 ratio is common—risking $1 to potentially gain $3.</p>
        
        <h3>Conclusion</h3>
        <p>Managing risk isn't about avoiding losses entirely but limiting them. A disciplined approach ensures long-term success.</p>
      `,
      quiz: [
        {
          question: "What is a stop-loss order designed to do?",
          options: ["Maximize profits", "Automatically sell at a set price to limit loss", "Buy more shares", "Increase position size"],
          correct: 1
        },
        {
          question: "What is the recommended risk-reward ratio mentioned in the lesson?",
          options: ["1:1", "1:2", "1:3", "1:4"],
          correct: 2
        },
        {
          question: "Which of these is NOT mentioned as a common risk in trading?",
          options: ["Market Risk", "Liquidity Risk", "Emotional Risk", "Currency Risk"],
          correct: 3
        },
        {
          question: "What is position sizing?",
          options: ["The size of your computer screen", "Allocating only a percentage of your capital", "The number of stocks available", "The time spent trading"],
          correct: 1
        },
        {
          question: "What is the main purpose of diversification?",
          options: ["To maximize returns", "To spread investments to reduce exposure", "To concentrate investments", "To increase trading frequency"],
          correct: 1
        }
      ]
    },
    {
      id: 5,
      title: 'Short Selling Basics',
      description: 'Understand how to profit when stock prices fall',
      difficulty: 'Advanced',
      duration: '25 min',
      completed: false,
      icon: '📉',
      content: `
        <h2>Short Selling Basics</h2>
        <h3>Understand how to profit when stock prices fall</h3>
        
        <p>Short selling is a strategy where traders bet against a stock. If the stock price falls, they profit. It's risky but can be profitable when used wisely.</p>
        
        <h3>How It Works</h3>
        <ol>
          <li>You borrow shares from a broker.</li>
          <li>Sell them at the current market price.</li>
          <li>If the stock drops, buy back at a lower price and return the shares.</li>
          <li>Your profit = Sell Price - Buy Price - Fees.</li>
        </ol>
        
        <h3>Risks of Short Selling</h3>
        <ul>
          <li><strong>Unlimited Loss Potential:</strong> If the stock rises, losses can be infinite.</li>
          <li><strong>Short Squeezes:</strong> Rapid price increases force shorts to buy back, increasing prices further.</li>
          <li><strong>Margin Requirements:</strong> Brokers require collateral.</li>
        </ul>
        
        <h3>When Is Shorting Used?</h3>
        <ul>
          <li>During market corrections.</li>
          <li>On overvalued stocks.</li>
          <li>As a hedge for long positions.</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Short selling offers opportunities but requires precision and risk control. It's a powerful tool in experienced hands.</p>
      `,
      quiz: [
        {
          question: "In short selling, when do you make a profit?",
          options: ["When the stock price rises", "When the stock price falls", "When the stock price stays the same", "Only during market hours"],
          correct: 1
        },
        {
          question: "What is the first step in short selling?",
          options: ["Buy shares at market price", "Borrow shares from a broker", "Sell your existing shares", "Wait for price to drop"],
          correct: 1
        },
        {
          question: "What is a major risk of short selling?",
          options: ["Limited profit potential", "Unlimited loss potential", "Low margin requirements", "Guaranteed profits"],
          correct: 1
        },
        {
          question: "What is a short squeeze?",
          options: ["When shorts make large profits", "Rapid price increases forcing shorts to buy back", "A type of trading platform", "A risk management tool"],
          correct: 1
        },
        {
          question: "When is short selling commonly used?",
          options: ["During market rallies only", "On undervalued stocks", "During market corrections", "Only in bear markets"],
          correct: 2
        }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3">
        <BookOpen className="w-8 h-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold gradient-text">Education Center</h1>
          <p className="text-gray-600">Learn the fundamentals of stock investing</p>
        </div>
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="card p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Lessons Completed</h3>
            <p className="text-2xl font-bold text-green-600">2 / 5</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Knowledge Level</h3>
            <p className="text-2xl font-bold text-blue-600">Beginner</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Study Streak</h3>
            <p className="text-2xl font-bold text-purple-600">3 days</p>
          </div>
        </div>
      </motion.div>

      {/* Lessons Grid */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {lessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            onClick={() => setSelectedLesson(lesson)}
            className={`card p-6 cursor-pointer transition-all duration-300 ${
              lesson.completed 
                ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
                : 'hover:shadow-lg'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{lesson.icon}</div>
              {lesson.completed && (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            
            <h3 className="font-bold text-gray-800 mb-2">{lesson.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>
            
            <div className="flex items-center justify-between text-xs">
              <span className={`px-2 py-1 rounded-full font-medium ${
                lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                lesson.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {lesson.difficulty}
              </span>
              <span className="text-gray-500">{lesson.duration}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Learning Tip */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="card p-6 bg-gradient-to-r from-purple-50 to-green-50"
      >
        <div className="flex items-start space-x-4">
          <div className="text-3xl">💡</div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Pro Tip</h3>
            <p className="text-gray-600">
              Complete lessons in order to build a strong foundation. Each lesson builds upon the previous one,
              ensuring you have all the knowledge needed for successful trading.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Lesson Modal */}
      <AnimatePresence>
        {selectedLesson && (
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
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{selectedLesson.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedLesson.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className={`px-2 py-1 rounded-full font-medium ${
                        selectedLesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                        selectedLesson.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedLesson.difficulty}
                      </span>
                      <span>{selectedLesson.duration}</span>
                      {selectedLesson.completed && (
                        <span className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Completed</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              {!quizMode ? (
                <>
                  <div className="space-y-8">
                    {/* Article Content with Better Styling */}
                    <div className="prose prose-lg max-w-none">
                      <div 
                        className="article-content"
                        dangerouslySetInnerHTML={{ __html: selectedLesson.content || 
                          `<h2>${selectedLesson.title}</h2>
                           <p>${selectedLesson.description}</p>
                           <p>This lesson content is coming soon! Check back later for detailed educational materials.</p>` 
                        }}
                      />
                    </div>
                    
                    {/* Key Takeaways Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                      <h3 className="flex items-center text-lg font-semibold text-blue-900 mb-4">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3">💡</span>
                        Key Takeaways
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getKeyTakeaways(selectedLesson.id).map((takeaway, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-blue-800">{takeaway}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Market Perspectives Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <h3 className="flex items-center text-lg font-semibold text-green-900 mb-4">
                          <span className="text-2xl mr-2">🐂</span>
                          What Bulls Say
                        </h3>
                        <div className="space-y-2">
                          {getBullishPoints(selectedLesson.id).map((point, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-sm text-green-800">{point}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <h3 className="flex items-center text-lg font-semibold text-red-900 mb-4">
                          <span className="text-2xl mr-2">🐻</span>
                          What Bears Say
                        </h3>
                        <div className="space-y-2">
                          {getBearishPoints(selectedLesson.id).map((point, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-sm text-red-800">{point}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Recent News Section */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                      <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                        <span className="text-2xl mr-2">📰</span>
                        Recent Market News & Trends
                        {newsLoading && (
                          <div className="ml-2 w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                        )}
                      </h3>
                      <div className="space-y-3">
                        {getRecentNews(selectedLesson.id).map((news, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
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
                                      title="Read full article"
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
                      {getRecentNews(selectedLesson.id).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>Loading latest market news...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setSelectedLesson(null)}
                      className="btn-secondary"
                    >
                      Close
                    </button>
                    {selectedLesson.quiz && (
                      <button
                        onClick={() => startQuiz(selectedLesson)}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <Target className="w-4 h-4" />
                        <span>Take Quiz</span>
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Quiz Content */}
                  {!quizCompleted ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Knowledge Check Quiz
                        </h3>
                        <p className="text-sm text-gray-600">
                          Answer all questions correctly to complete this lesson
                        </p>
                      </div>
                      
                      {selectedLesson.quiz.map((question, qIndex) => (
                        <div key={qIndex} className="bg-gray-50 p-6 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-4">
                            {qIndex + 1}. {question.question}
                          </h4>
                          <div className="space-y-2">
                            {question.options.map((option, oIndex) => (
                              <label
                                key={oIndex}
                                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                                  selectedAnswers[qIndex] === oIndex
                                    ? 'bg-accent text-white'
                                    : 'bg-white hover:bg-gray-100'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${qIndex}`}
                                  checked={selectedAnswers[qIndex] === oIndex}
                                  onChange={() => selectAnswer(qIndex, oIndex)}
                                  className="sr-only"
                                />
                                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                                  selectedAnswers[qIndex] === oIndex
                                    ? 'border-white bg-white'
                                    : 'border-gray-300'
                                }`}>
                                  {selectedAnswers[qIndex] === oIndex && (
                                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                                  )}
                                </div>
                                {option}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <button
                          onClick={resetQuiz}
                          className="btn-secondary"
                        >
                          Back to Article
                        </button>
                        <button
                          onClick={submitQuiz}
                          disabled={Object.keys(selectedAnswers).length < selectedLesson.quiz.length}
                          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Submit Quiz
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Quiz Results */}
                      <div className="text-center space-y-6">
                        <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl ${
                          quizScore === selectedLesson.quiz.length 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {quizScore === selectedLesson.quiz.length ? '🎉' : '📚'}
                        </div>
                        
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Quiz Complete!
                          </h3>
                          <p className="text-lg text-gray-600">
                            You scored {quizScore} out of {selectedLesson.quiz.length} questions correctly
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            ({Math.round((quizScore / selectedLesson.quiz.length) * 100)}%)
                          </p>
                        </div>
                        
                        {quizScore === selectedLesson.quiz.length ? (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-center space-x-2 text-green-700">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-medium">Lesson Completed!</span>
                            </div>
                            <p className="text-sm text-green-600 mt-1">
                              Perfect score! You've mastered this topic.
                            </p>
                          </div>
                        ) : (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-700">
                              You need a perfect score to complete this lesson. Review the material and try again!
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <button
                          onClick={resetQuiz}
                          className="btn-secondary"
                        >
                          Back to Article
                        </button>
                        {quizScore === selectedLesson.quiz.length ? (
                          <button
                            onClick={() => setSelectedLesson(null)}
                            className="btn-primary"
                          >
                            Continue Learning
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setQuizCompleted(false);
                              setSelectedAnswers({});
                              setQuizScore(0);
                            }}
                            className="btn-primary"
                          >
                            Retry Quiz
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Education;