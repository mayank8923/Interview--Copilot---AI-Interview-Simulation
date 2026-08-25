import React from 'react';
import { X, CheckCircle, AlertTriangle, Lightbulb, Clock, Cpu } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AiFeedbackDrawer = ({ feedback, onClose }) => {
  if (!feedback) return null;

  const isGood = feedback.score >= 75;
  const isOk = feedback.score >= 50 && feedback.score < 75;

  return (
    <div className="absolute inset-x-0 bottom-0 top-1/2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-bottom-full duration-300 z-50">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-indigo-500" />
          AI Copilot Feedback
        </h3>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
        
        {/* Score Column */}
        <div className="flex flex-col items-center justify-center min-w-[200px] border-r border-slate-100 dark:border-slate-800 pr-8 hidden md:flex">
          <div className="relative flex items-center justify-center w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="12" fill="none" />
              <circle cx="64" cy="64" r="56" 
                className={`transition-all duration-1000 ease-out ${
                  isGood ? 'stroke-emerald-500' : isOk ? 'stroke-amber-500' : 'stroke-rose-500'
                }`} 
                strokeWidth="12" 
                fill="none" 
                strokeDasharray="351.858"
                strokeDashoffset={351.858 - (351.858 * feedback.score) / 100}
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{feedback.score}</span>
              <span className="text-xs font-medium text-slate-500">/ 100</span>
            </div>
          </div>
          <p className="mt-4 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
            {isGood ? 'Great Job!' : isOk ? 'Needs Improvement' : 'Keep Practicing'}
          </p>
        </div>

        {/* Details Column */}
        <div className="flex-1 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
              {feedback.feedback}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-3">
                <CheckCircle className="w-4 h-4" /> Strengths
              </h4>
              <ul className="space-y-2">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-3">
                <AlertTriangle className="w-4 h-4" /> Areas to Improve
              </h4>
              <ul className="space-y-2">
                {feedback.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {(feedback.timeComplexity || feedback.spaceComplexity) && (
            <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              {feedback.timeComplexity && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  Time: <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{feedback.timeComplexity}</span>
                </div>
              )}
              {feedback.spaceComplexity && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Cpu className="w-4 h-4 text-violet-400" />
                  Space: <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{feedback.spaceComplexity}</span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

