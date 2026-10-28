import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Terminal, Video, FileText, CheckCircle2, ArrowRight, Zap, Target, BarChart3, Code2, ShieldCheck, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f6] dark:bg-[#0c0d0f] text-stone-900 dark:text-stone-100 transition-colors overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[250px] bg-orange-500/10 dark:bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Subtle Announcement Pill */}
          <div 
            onClick={() => navigate('/practice')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#131418] border border-stone-200 dark:border-stone-800 shadow-sm text-xs font-semibold text-stone-700 dark:text-stone-300 mb-8 cursor-pointer hover:border-amber-500/50 hover:shadow-md transition-all group"
          >
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-amber-600 dark:text-amber-400 font-bold">New</span>
            <span>150+ FAANG Coding & System Design Problems</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Main Hero Header */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] text-stone-900 dark:text-white">
            Master Tech Interviews with an{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Intelligent AI Copilot
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Ace coding challenges with automated testcase execution, progressive hints, and simulate voice-driven behavioral & system design interview rounds.
          </p>

          {/* Action CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button 
              onClick={() => navigate('/practice')} 
              size="lg" 
              className="w-full sm:w-auto px-7 py-3 text-sm font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35 hover:-translate-y-0.5 transition-all text-stone-950 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500"
            >
              Start Coding Practice
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto px-7 py-3 text-sm font-semibold border-stone-300 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-[#1a1b20] transition-all"
            >
              Simulate AI Mock Interview
            </Button>
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="p-7 rounded-2xl bg-white dark:bg-[#131418] border border-stone-200/90 dark:border-stone-800/80 shadow-sm hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 transition-all">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 border border-amber-500/20">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
                LeetCode-Style Sandbox
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Run code against sample test cases and submit against 100+ hidden edge cases with instant runtime beats % analysis.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-7 rounded-2xl bg-white dark:bg-[#131418] border border-stone-200/90 dark:border-stone-800/80 shadow-sm hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all">
              <div className="w-11 h-11 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-5 border border-orange-500/20">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
                Live Voice AI Interviews
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Interactive technical and behavioral interview simulation with dynamic follow-up questions and audio speech synthesis.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-7 rounded-2xl bg-white dark:bg-[#131418] border border-stone-200/90 dark:border-stone-800/80 shadow-sm hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 transition-all">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 border border-amber-500/20">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
                Scorecards & Feedback
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Multidimensional analysis across algorithm correctness, time/space complexity, and STAR behavioral criteria.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
