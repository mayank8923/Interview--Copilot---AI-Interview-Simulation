import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { Target, BookOpen, Clock, FileText, ArrowRight, TrendingUp, Award, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MockSetupModal } from '../mock/MockSetupModal';
import { Link } from 'react-router-dom';
import { getDashboardAnalytics } from '../../api/analyticsApi';

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
    <div className="flex-1 bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 rounded-3xl p-8 shadow-xl shadow-indigo-500/20 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden animate-fade-in">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-indigo-900 opacity-20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 drop-shadow-sm">
              Welcome back, {user?.name || 'Developer'}! <span className="inline-block hover:animate-bounce">👋</span>
            </h1>
            <p className="text-indigo-100 font-medium text-lg">
              Your target role: <strong className="text-white bg-white/20 px-3 py-1 rounded-full ml-2 backdrop-blur-sm">{user?.targetRole || 'Not set'}</strong>
            </p>
          </div>
          <Button onClick={() => setIsMockModalOpen(true)} className="relative z-10 bg-white text-indigo-600 hover:bg-slate-50 hover:text-indigo-700 shadow-lg font-bold px-6 py-3 border-0 transition-transform hover:scale-105" icon={ArrowRight}>
            Start New Mock
          </Button>
        </div>

        {/* Analytics Section */}
        {loading ? (
          <div className="h-64 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center">
             <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Readiness Score Gauge */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-200/40 dark:shadow-none flex flex-col items-center justify-center relative overflow-hidden hover:-translate-y-1 transition-all duration-300 animate-fade-up">
              <div className="absolute top-6 left-6 flex items-center gap-2 text-slate-500">
                <Target className="w-5 h-5 text-indigo-500" />
                <span className="font-bold text-sm tracking-wide uppercase">Readiness</span>
              </div>
              
              <div className="relative flex items-center justify-center w-52 h-52 mt-8">
                {/* Glow behind the circle */}
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full filter blur-2xl animate-pulse" />
                
                <svg className="w-full h-full transform -rotate-90 relative z-10 drop-shadow-md">
                  <circle cx="104" cy="104" r="90" className="stroke-slate-100 dark:stroke-slate-700/50" strokeWidth="18" fill="none" />
                  <circle cx="104" cy="104" r="90" 
                    className="stroke-indigo-500 transition-all duration-1500 ease-out drop-shadow-glow" 
                    strokeWidth="18" 
                    fill="none" 
                    strokeDasharray="565.48"
                    strokeDashoffset={565.48 - (565.48 * (analytics?.readinessScore || 0)) / 100}
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                  <span className="text-6xl font-black text-slate-900 dark:text-white drop-shadow-sm">
                    {analytics?.readinessScore || 0}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 mt-1">Score</span>
                </div>
              </div>
            </div>

            {/* Breakdown Stats */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-200/40 dark:shadow-none flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-2xl flex items-center justify-center shadow-inner">
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{analytics?.avgMockScore || 0}%</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">Mock Average</h3>
                  <p className="text-sm font-medium text-slate-500">{analytics?.totalMockSessions || 0} sessions completed</p>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-200/40 dark:shadow-none flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-violet-50 dark:bg-violet-900/30 text-violet-500 rounded-2xl flex items-center justify-center shadow-inner">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{analytics?.avgPracticeScore || 0}%</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">Practice Score</h3>
                  <p className="text-sm font-medium text-slate-500">{analytics?.totalPracticeQuestions || 0} questions attempted</p>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-200/40 dark:shadow-none flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{analytics?.latestResumeScore || 0}%</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">Resume Match</h3>
                  <p className="text-sm font-medium text-slate-500">Based on latest PDF scan</p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-fade-up" style={{ animationDelay: '0.1s' }} onClick={() => setIsMockModalOpen(true)}>
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/40 dark:to-indigo-900/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-5 shadow-inner transition-transform group-hover:scale-110">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Timed Mock</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 font-medium">
              Simulate a 30-min interview.
            </p>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Start Session <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          <Link to="/chat-interview" className="block group bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-5 shadow-inner transition-transform group-hover:scale-110">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">AI Chat Interview</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 font-medium">
              Interactive voice chat with an AI interviewer.
            </p>
            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Start Chat <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link to="/practice" className="block group bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-2 transition-all duration-300 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-violet-50 dark:from-violet-900/40 dark:to-violet-900/10 text-violet-600 dark:text-violet-400 rounded-2xl flex items-center justify-center mb-5 shadow-inner transition-transform group-hover:scale-110">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Practice Catalog</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 font-medium">
              Browse specific algorithms or behavioral questions.
            </p>
            <span className="text-violet-600 dark:text-violet-400 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Browse Questions <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
          
          <Link to="/resume" className="block group bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-2 transition-all duration-300 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-900/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-5 shadow-inner transition-transform group-hover:scale-110">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Resume Scan</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 font-medium">
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
