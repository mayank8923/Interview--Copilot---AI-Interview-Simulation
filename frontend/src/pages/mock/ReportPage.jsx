import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMockReport } from '../../api/mockApi';
import { RadarScoreChart } from '../../components/analytics/RadarScoreChart';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, CheckCircle, AlertTriangle, FileText, Loader2 } from 'lucide-react';

export const ReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getMockReport(id);
        setReport(data);
      } catch (err) {
        console.error('Failed to load report', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
        <p>Report not found or not generated yet.</p>
        <Button className="mt-4" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
      </div>
    );
  }

  const isGood = report.overallScore >= 75;
  const isOk = report.overallScore >= 50 && report.overallScore < 75;

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button onClick={() => navigate('/dashboard')} className="text-slate-500 hover:text-indigo-600 flex items-center gap-2 text-sm font-medium mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-500" />
              Interview Scorecard
            </h1>
          </div>
          <div className={`px-6 py-3 rounded-2xl border-2 flex flex-col items-center justify-center bg-white dark:bg-slate-800 shadow-sm
            ${isGood ? 'border-emerald-500 text-emerald-600' : isOk ? 'border-amber-500 text-amber-600' : 'border-rose-500 text-rose-600'}
          `}>
            <span className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Overall Score</span>
            <span className="text-4xl font-black">{report.overallScore}</span>
          </div>
        </div>

        {/* Top Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
            {report.feedback}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Radar Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Performance Matrix</h3>
            <div className="flex-1 flex items-center justify-center">
              <RadarScoreChart metrics={report.radarMetrics} />
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="space-y-6">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 p-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400 mb-4">
                <CheckCircle className="w-5 h-5" /> Key Strengths
              </h3>
              <ul className="space-y-3">
                {report.aggregateStrengths?.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-50 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/30 p-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-rose-700 dark:text-rose-400 mb-4">
                <AlertTriangle className="w-5 h-5" /> Focus Areas
              </h3>
              <ul className="space-y-3">
                {report.aggregateWeaknesses?.map((w, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

