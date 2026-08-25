import React from 'react';
import { Sparkles, Github, BookOpen, Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">
            Interview Copilot
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            © 2026 All rights reserved.
          </span>
        </div>

        <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center">
            <Shield className="w-4 h-4 mr-1 text-emerald-500" />
            Spring Boot 3 + MongoDB Atlas
          </span>
          <span className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1 text-indigo-500" />
            React 18 + Vite
          </span>
        </div>
      </div>
    </footer>
  );
};

