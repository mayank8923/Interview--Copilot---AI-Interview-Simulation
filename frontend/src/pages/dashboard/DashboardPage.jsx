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
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome back, {user?.name || 'Developer'}! 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Your target role: <strong className="text-indigo-600 dark:text-indigo-400">{user?.targetRole || 'Not set'}</strong>
            </p>
          </div>
          <Button onClick={() => setIsMockModalOpen(true)} icon={ArrowRight}>
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
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-4 left-4 flex items-center gap-2 text-slate-500">
                <Target className="w-5 h-5" />
                <span className="font-semibold text-sm">Readiness</span>
              </div>
              
              <div className="relative flex items-center justify-center w-48 h-48 mt-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="84" className="stroke-slate-100 dark:stroke-slate-700" strokeWidth="16" fill="none" />
                  <circle cx="96" cy="96" r="84" 
                    className="stroke-indigo-500 transition-all duration-1000 ease-out" 
                    strokeWidth="16" 
                    fill="none" 
                    strokeDasharray="527.78"
                    strokeDashoffset={527.78 - (527.78 * (analytics?.readinessScore || 0)) / 100}
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-slate-900 dark:text-white">
                    {analytics?.readinessScore || 0}
                  </span>
                  <span className="text-sm font-medium uppercase tracking-wider text-slate-500">/ 100</span>
                </div>
              </div>
            </div>

            {/* Breakdown Stats */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics?.avgMockScore || 0}%</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Mock Average</h3>
                  <p className="text-sm text-slate-500">{analytics?.totalMockSessions || 0} sessions completed</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/30 text-violet-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics?.avgPracticeScore || 0}%</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Practice Score</h3>
                  <p className="text-sm text-slate-500">{analytics?.totalPracticeQuestions || 0} questions attempted</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics?.latestResumeScore || 0}%</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Resume Match</h3>
                  <p className="text-sm text-slate-500">Based on latest PDF scan</p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsMockModalOpen(true)}>
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Timed Mock</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Simulate a 30-min interview.
            </p>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Start Session <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          <Link to="/chat-interview" className="block bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI Chat Interview</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Interactive back-and-forth chat with an AI interviewer.
            </p>
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Start Chat <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link to="/practice" className="block bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Practice Catalog</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Browse specific algorithms or behavioral questions to practice.
            </p>
            <span className="text-violet-600 dark:text-violet-400 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Browse Questions <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
          
          <Link to="/resume" className="block bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Resume Alignment</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Upload your PDF resume to extract skills and find missing keywords.
            </p>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Scan Resume <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>
      <MockSetupModal isOpen={isMockModalOpen} onClose={() => setIsMockModalOpen(false)} />
    </div>
  );
}
