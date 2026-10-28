import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { Target, BookOpen, Clock, FileText, ArrowRight, TrendingUp, Award, Loader2, Mic } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MockSetupModal } from '../mock/MockSetupModal';
import { Link } from 'react-router-dom';
import { getDashboardAnalytics } from '../../api/analyticsApi';
import { ActivityHeatmap } from '../../components/analytics/ActivityHeatmap';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [isMockModalOpen, setIsMockModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getDashboardAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="flex-1 bg-[#fbf9f6] dark:bg-[#0c0d0f] py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 rounded-3xl p-8 shadow-xl shadow-amber-500/20 text-stone-950 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden animate-fade-in">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-orange-950 opacity-20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 drop-shadow-sm text-stone-950">
              Welcome back, {user?.name || 'Developer'}! <span className="inline-block hover:animate-bounce">👋</span>
            </h1>
            <p className="text-stone-900/80 font-medium text-lg">
              Your target role: <strong className="text-stone-950 bg-white/40 px-3 py-1 rounded-full ml-2 backdrop-blur-sm">{user?.targetRole || 'Not set'}</strong>
            </p>
          </div>
          <Button onClick={() => setIsMockModalOpen(true)} className="relative z-10 bg-stone-950 text-white hover:bg-stone-900 shadow-lg font-bold px-6 py-3 border-0 transition-transform hover:scale-105" icon={ArrowRight}>
            Start New Mock
          </Button>
        </div>

        {/* Analytics Section */}
        {loading ? (
          <div className="h-64 bg-white dark:bg-[#131418] rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center justify-center">
             <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Readiness Score Gauge */}
            <div className="bg-white/80 dark:bg-[#131418] backdrop-blur-sm rounded-3xl p-6 border border-stone-200 dark:border-stone-800/80 shadow-sm flex flex-col items-center justify-center relative overflow-hidden hover:-translate-y-1 transition-all duration-300 animate-fade-up">
              <div className="absolute top-6 left-6 flex items-center gap-2 text-stone-500">
                <Target className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-sm tracking-wide uppercase">Readiness</span>
              </div>
              
              <div className="relative flex items-center justify-center w-52 h-52 mt-8">
                {/* Glow behind the circle */}
                <div className="absolute inset-0 bg-amber-500/20 rounded-full filter blur-2xl animate-pulse" />
                
                <svg className="w-full h-full transform -rotate-90 relative z-10 drop-shadow-md">
                  <circle cx="104" cy="104" r="90" className="stroke-stone-100 dark:stroke-stone-800" strokeWidth="18" fill="none" />
                  <circle cx="104" cy="104" r="90" 
                    className="stroke-amber-500 transition-all duration-1500 ease-out drop-shadow-glow" 
                    strokeWidth="18" 
                    fill="none" 
                    strokeDasharray="565.48"
                    strokeDashoffset={565.48 - (565.48 * (analytics?.readinessScore || 0)) / 100}
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                  <span className="text-6xl font-black text-stone-900 dark:text-white drop-shadow-sm">
                    {analytics?.readinessScore || 0}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-500 mt-1">Score</span>
                </div>
              </div>
            </div>

            {/* Breakdown Stats */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="bg-white/80 dark:bg-[#131418] backdrop-blur-sm rounded-3xl p-6 border border-stone-200 dark:border-stone-800/80 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center shadow-inner">
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-stone-900 dark:text-white">{analytics?.avgMockScore || 0}%</span>
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-white mb-1">Mock Average</h3>
                  <p className="text-sm font-medium text-stone-500">{analytics?.totalMockSessions || 0} sessions completed</p>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-[#131418] backdrop-blur-sm rounded-3xl p-6 border border-stone-200 dark:border-stone-800/80 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center shadow-inner">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-stone-900 dark:text-white">{analytics?.avgPracticeScore || 0}%</span>
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-white mb-1">Practice Score</h3>
                  <p className="text-sm font-medium text-stone-500">{analytics?.totalPracticeQuestions || 0} questions attempted</p>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-[#131418] backdrop-blur-sm rounded-3xl p-6 border border-stone-200 dark:border-stone-800/80 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-stone-900 dark:text-white">{analytics?.latestResumeScore || 0}%</span>
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-white mb-1">Resume Match</h3>
                  <p className="text-sm font-medium text-stone-500">Based on latest PDF scan</p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Daily Streak & Activity Heatmap */}
        <ActivityHeatmap />

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-white/70 dark:bg-[#131418] backdrop-blur-sm rounded-3xl p-6 border border-stone-200 dark:border-stone-800/80 shadow-sm hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-fade-up" style={{ animationDelay: '0.1s' }} onClick={() => setIsMockModalOpen(true)}>
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-500 rounded-2xl flex items-center justify-center mb-5 shadow-inner transition-transform group-hover:scale-110">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Timed Mock</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-5 font-medium">
              Simulate a 30-min interview.
            </p>
            <span className="text-amber-500 dark:text-amber-400 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Start Session <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          <Link to="/chat-interview" className="block group bg-white/70 dark:bg-[#131418] backdrop-blur-sm rounded-3xl p-6 border border-stone-200 dark:border-stone-800/80 shadow-sm hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-500 rounded-2xl flex items-center justify-center mb-5 shadow-inner transition-transform group-hover:scale-110">
              <Mic className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Voice AI Assistant</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-5 font-medium">
              Simulate spoken rounds with FAANG personas and scorecard evaluation.
            </p>
            <span className="text-amber-500 dark:text-amber-400 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Start Voice Round <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link to="/practice" className="block group bg-white/70 dark:bg-[#131418] backdrop-blur-sm rounded-3xl p-6 border border-stone-200 dark:border-stone-800/80 shadow-sm hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-500 rounded-2xl flex items-center justify-center mb-5 shadow-inner transition-transform group-hover:scale-110">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Practice Catalog</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-5 font-medium">
              Browse specific algorithms or behavioral questions.
            </p>
            <span className="text-amber-500 dark:text-amber-400 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Browse Questions <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
          
          <Link to="/resume" className="block group bg-white/70 dark:bg-[#131418] backdrop-blur-sm rounded-3xl p-6 border border-stone-200 dark:border-stone-800/80 shadow-sm hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-500 rounded-2xl flex items-center justify-center mb-5 shadow-inner transition-transform group-hover:scale-110">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Resume Scan</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-5 font-medium">
              Find missing keywords for your target role.
            </p>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Scan Resume <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>
      <MockSetupModal isOpen={isMockModalOpen} onClose={() => setIsMockModalOpen(false)} />
    </div>
  );
}
