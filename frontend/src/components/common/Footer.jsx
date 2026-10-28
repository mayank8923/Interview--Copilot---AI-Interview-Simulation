import React from 'react';
import { Sparkles, Github, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-stone-200/90 dark:border-stone-800/80 bg-white dark:bg-[#0c0d0f] py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-stone-950 shadow-sm shadow-amber-500/20">
            <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
          </div>
          <span className="font-bold text-sm text-stone-900 dark:text-white tracking-tight">
            Interview<span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Copilot</span>
          </span>
          <span className="text-xs text-stone-400 dark:text-stone-500 ml-2">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium text-stone-500 dark:text-stone-400">
          <Link to="/practice" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
            Question Bank
          </Link>
          <a href="/#features" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
            Features
          </a>
          <Link to="/privacy" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-stone-300 dark:text-stone-700 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-stone-400 dark:text-stone-500">
            Engineered with modern AI
          </span>
        </div>

      </div>
    </footer>
  );
};
