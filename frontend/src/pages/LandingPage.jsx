import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Terminal, Video, FileText, CheckCircle2, ArrowRight, Zap, Target, BarChart3, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import axiosClient from '../api/axiosClient';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [healthStatus, setHealthStatus] = useState({ state: 'checking', message: 'Checking backend API...' });

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await axiosClient.get('/health');
        if (response.success) {
          setHealthStatus({ state: 'connected', message: `${response.data.service} (${response.data.version}) is UP` });
        } else {
          setHealthStatus({ state: 'error', message: 'Backend returned non-success' });
        }
      } catch (err) {
        setHealthStatus({ state: 'offline', message: 'Backend currently offline (Start Spring Boot on :8080)' });
      }
    };

    checkBackendHealth();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Backend Connectivity Status Banner */}
      <div className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              healthStatus.state === 'connected' ? 'bg-emerald-500 animate-pulse' :
              healthStatus.state === 'checking' ? 'bg-amber-500 animate-ping' : 'bg-rose-500'
            }`} />
            <span className="font-mono text-slate-600 dark:text-slate-300">
              API Status: <strong>{healthStatus.message}</strong>
            </span>
          </div>
          <span className="hidden sm:inline font-mono text-slate-500 dark:text-slate-400">
            Sprint 0 Initialized
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-900">
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 dark:opacity-10 animate-float" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-violet-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 dark:opacity-10 animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Highlight Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            <span>AI-Powered Technical & HR Simulation</span>
          </div>

          {/* Main Hero Header */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-tight animate-fade-up">
            Crack Your Dream Tech Role with{' '}
            <span className="relative whitespace-nowrap">
              <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500">
                Real-Time AI Copilot
              </span>
            </span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Unified preparation platform for students and job seekers. Practice 150+ curated DSA questions, simulate live interactive voice AI interviews, and get multidimensional feedback scorecards.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Button onClick={() => navigate('/dashboard')} size="lg" icon={ArrowRight} className="w-full sm:w-auto shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300 text-base px-8 py-4">
              Start AI Mock Interview
            </Button>
            <Button onClick={() => navigate('/practice')} variant="outline" size="lg" icon={Terminal} className="w-full sm:w-auto hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 text-base px-8 py-4">
              Explore Practice Bank
            </Button>
          </div>

          {/* Quick Metrics / Feature Pillars */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="p-8 rounded-3xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/20 dark:border-slate-700/50 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/40 dark:to-indigo-900/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 shadow-inner">
                <Video className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Live Voice AI Interviews
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Experience realistic adaptive technical & HR rounds with live speech-to-text and instant transcript scoring.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-3xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/20 dark:border-slate-700/50 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-2 transition-all duration-300 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-violet-50 dark:from-violet-900/40 dark:to-violet-900/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-6 shadow-inner">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Resume Role Alignment
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Upload your PDF resume to extract key skills, identify missing role-specific keywords, and get section-by-section tips.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-3xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/20 dark:border-slate-700/50 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 transition-all duration-300 animate-fade-up" style={{ animationDelay: '0.5s' }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-900/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-inner">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Dynamic Readiness Score
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Track readiness from 0 to 100 with 5-dimension radar charts and personalized weakness topic recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

