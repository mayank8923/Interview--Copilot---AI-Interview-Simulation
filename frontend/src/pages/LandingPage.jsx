import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, Video, FileText, CheckCircle2, ArrowRight, Zap, Target, BarChart3, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import axiosClient from '../api/axiosClient';

export const LandingPage = () => {
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
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Highlight Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>AI-Powered Technical & HR Simulation</span>
          </div>

          {/* Main Hero Header */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Crack Your Dream Tech Role with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500">
              Real-Time AI Copilot
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
            Unified preparation platform for students and job seekers. Practice 50+ curated DSA questions, simulated timed mock interviews, resume matching, and multidimensional feedback scorecards.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" icon={ArrowRight} className="w-full sm:w-auto shadow-lg shadow-indigo-500/25">
              Start AI Mock Interview
            </Button>
            <Button variant="outline" size="lg" icon={Terminal} className="w-full sm:w-auto">
              Explore Practice Bank
            </Button>
          </div>

          {/* Quick Metrics / Feature Pillars */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                15/30-Min AI Mock Interviews
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Experience realistic adaptive technical & HR rounds with live countdown timers and instant transcript scoring.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Resume Role Alignment
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Upload your PDF resume to extract key skills, identify missing role-specific keywords, and get section-by-section tips.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Dynamic Readiness Score
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Track readiness from 0 to 100 with 5-dimension radar charts and personalized weakness topic recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

