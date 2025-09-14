import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  PieChart, 
  TrendingUp, 
  ArrowLeftRight, 
  GraduationCap, 
  Settings,
  BarChart3,
  Wallet,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const location = useLocation();
  const { currentLevel, totalPoints } = useSelector(state => state.user);
  const { activePortfolio } = useSelector(state => state.portfolio);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      name: 'Portfolio',
      href: '/portfolio',
      icon: PieChart,
      badge: activePortfolio?.positions?.length || 0
    },
    {
      name: 'Market',
      href: '/market',
      icon: BarChart3,
    },
    {
      name: 'Trading',
      href: '/trading',
      icon: ArrowLeftRight,
    },
    {
      name: 'Education',
      href: '/education',
      icon: GraduationCap,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: Settings,
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg bg-white border border-gray-200 shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5 text-gray-600" />
        ) : (
          <Menu className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[45]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ 
          x: 0, 
          opacity: 1,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`
          fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Stocky</h1>
              <p className="text-xs text-gray-500">Investment Learning</p>
            </div>
          </div>
        </div>

        {/* Level & Stats */}
        <div className="p-4 border-b border-gray-100">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Level {currentLevel}</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Active</span>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentLevel / 5) * 100}%` }}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                className="bg-gray-900 h-1.5 rounded-full"
              ></motion.div>
            </div>
            
            <div className="text-xs text-gray-500">
              {totalPoints.toLocaleString()} points earned
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navigation.map((item, index) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
              
              return (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.05, ease: "easeOut" }}
                >
                  <NavLink
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      group flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200 relative
                      ${isActive 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.name}</span>
                    
                    {/* Badge */}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`
                        ml-auto text-xs px-2 py-0.5 rounded-full font-medium
                        ${isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-100 text-gray-600'
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </motion.div>
              );
            })}
          </div>
        </nav>

        {/* Quick Stats */}
        <div className="p-4 border-t border-gray-100">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Cash</span>
              </div>
              <span className="font-mono font-medium text-gray-900">
                ${activePortfolio?.cash?.toFixed(0) || '0'}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <PieChart className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Positions</span>
              </div>
              <span className="font-medium text-gray-900">
                {activePortfolio?.positions?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;