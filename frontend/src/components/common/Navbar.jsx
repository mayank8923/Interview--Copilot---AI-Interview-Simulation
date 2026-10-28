import React, { useState, useEffect } from 'react';
import { Sparkles, Moon, Sun, Menu, X, ArrowRight, User as UserIcon, LogOut, Code2, Compass } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { StreakBadge } from './StreakBadge';

export const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check initial dark mode from DOM or localStorage
    const isDark = document.documentElement.classList.contains('dark') || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextState = !isDarkMode;
    setIsDarkMode(nextState);
    if (nextState) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path) => {
    const active = isActive(path);
    return `text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 ${
      active
        ? 'text-amber-500 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/15 shadow-sm'
        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/70 dark:hover:bg-[#1a1b20]'
    }`;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-[#0c0d0f]/90 border-b border-stone-200/90 dark:border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-stone-950 shadow-sm shadow-amber-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 fill-stone-950" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base text-stone-900 dark:text-white tracking-tight">
              Interview<span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Copilot</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hidden sm:inline-block">
              AI
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                Dashboard
              </Link>
              <Link to="/practice" className={navLinkClass('/practice')}>
                Practice Bank
              </Link>
              <Link to="/chat-interview" className={navLinkClass('/chat-interview')}>
                Voice AI
              </Link>
              <Link to="/profile" className={navLinkClass('/profile')}>
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link to="/practice" className={navLinkClass('/practice')}>
                Question Bank
              </Link>
              <a href="/#features" className="text-xs font-semibold px-3 py-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/70 dark:hover:bg-[#1a1b20] transition-colors">
                Features
              </a>
            </>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isAuthenticated && <StreakBadge />}

          {/* Dark Mode Switch */}
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-[#1a1b20] border border-transparent hover:border-stone-200 dark:hover:border-stone-700/60 transition-all"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User / Auth Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-stone-100/70 dark:bg-[#18191e] border border-stone-200/80 dark:border-stone-800">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center text-xs font-extrabold uppercase">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 max-w-[120px] truncate">
                    {user?.name || 'Account'}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 text-stone-500 hover:text-rose-600 dark:text-stone-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-xs font-semibold px-3 py-1.5">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="text-xs font-bold px-3.5 py-1.5 shadow-sm shadow-amber-500/20">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121316] px-4 py-3 space-y-2">
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <Link 
                to="/practice" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Practice Bank
              </Link>
              <Link 
                to="/chat-interview" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 dark:hover:bg-amber-500/15"
              >
                Voice AI Interview
              </Link>
              <Link 
                to="/profile" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                Logout ({user?.name})
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/practice" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                Practice Bank
              </Link>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="secondary" size="sm" className="w-full justify-center">Sign In</Button>
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full justify-center">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
