import React from 'react';
import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export const ResumeScorecard = ({ analysis }) => {
  if (!analysis) return null;

  const isGood = analysis.matchScore >= 75;
  const isOk = analysis.matchScore >= 50 && analysis.matchScore < 75;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col md:flex-row items-center gap-8">
        
        {/* Gauge */}
        <div className="relative flex items-center justify-center w-40 h-40 shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="80" cy="80" r="70" className="stroke-slate-100 dark:stroke-slate-700" strokeWidth="12" fill="none" />
            <circle cx="80" cy="80" r="70" 
              className={`transition-all duration-1000 ease-out ${
                isGood ? 'stroke-emerald-500' : isOk ? 'stroke-amber-500' : 'stroke-rose-500'
              }`} 
              strokeWidth="12" 
              fill="none" 
              strokeDasharray="439.8"
              strokeDashoffset={439.8 - (439.8 * analysis.matchScore) / 100}
              strokeLinecap="round" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-slate-900 dark:text-white">{analysis.matchScore}</span>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Match</span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Target Role: {analysis.targetRole}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {isGood ? 'Your resume is highly aligned with this role!' : 
             isOk ? 'Your resume is a decent match, but missing some key terms.' : 
             'Significant gaps found for this role.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 p-6">
          <h4 className="font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400 mb-4">
            <CheckCircle className="w-5 h-5" /> Matched Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.matchedKeywords?.map((kw, i) => (
              <span key={i} className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm font-medium rounded-full">
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-rose-50 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/30 p-6">
          <h4 className="font-bold flex items-center gap-2 text-rose-700 dark:text-rose-400 mb-4">
            <AlertCircle className="w-5 h-5" /> Missing Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.missingKeywords?.map((kw, i) => (
              <span key={i} className="px-3 py-1 bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-sm font-medium rounded-full">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h4 className="font-bold flex items-center gap-2 text-slate-900 dark:text-white mb-4">
          <TrendingUp className="w-5 h-5 text-indigo-500" /> Actionable Suggestions
        </h4>
        <ul className="space-y-3">
          {analysis.suggestions?.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

