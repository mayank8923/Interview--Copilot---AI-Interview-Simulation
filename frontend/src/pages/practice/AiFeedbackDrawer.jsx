import React from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Lightbulb, 
  Clock, 
  Cpu, 
  Sparkles,
  Zap,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AiFeedbackDrawer = ({ feedback, onClose, onNextQuestion }) => {
  if (!feedback) return null;

  const isAccepted = feedback.score >= 70;
  
  // Calculate simulated percentile rank based on score
  const runtimeMs = Math.floor(Math.random() * 20) + 32;
  const memoryMb = (Math.random() * 3 + 40).toFixed(1);
  const runtimePercentile = Math.min(99, Math.max(65, Math.floor(feedback.score * 0.95 + Math.random() * 5)));
  const memoryPercentile = Math.min(98, Math.max(60, Math.floor(feedback.score * 0.88 + Math.random() * 8)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#16171d] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#1a1b22]">
          <div className="flex items-center gap-2.5">
            {isAccepted ? (
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center text-rose-500">
                <XCircle className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className={`text-lg font-bold tracking-tight ${isAccepted ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isAccepted ? 'Accepted' : 'Wrong Answer / Incomplete'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAccepted ? 'All 100 test cases passed!' : 'Solution did not pass all verification constraints.'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* LeetCode Stats Row */}
          {isAccepted && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Runtime Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#1c1d24] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Runtime
                  </span>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Beats {runtimePercentile}%
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{runtimeMs}</span>
                  <span className="text-xs text-slate-500">ms</span>
                </div>
              </div>

              {/* Memory Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#1c1d24] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-amber-400" /> Memory
                  </span>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Beats {memoryPercentile}%
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{memoryMb}</span>
                  <span className="text-xs text-slate-500">MB</span>
                </div>
              </div>
            </div>
          )}

          {/* Time & Space Complexity */}
          {(feedback.timeComplexity || feedback.spaceComplexity) && (
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Time Complexity:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {feedback.timeComplexity || 'O(N)'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Space Complexity:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {feedback.spaceComplexity || 'O(1)'}
                </span>
              </div>
            </div>
          )}

          {/* AI Coach Feedback */}
          {feedback.feedback && (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1a1b22]">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Interviewer Feedback
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {feedback.feedback}
              </p>
            </div>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {feedback.strengths?.length > 0 && (
              <div className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-950/50 bg-emerald-50/30 dark:bg-emerald-950/20">
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.weaknesses?.length > 0 && (
              <div className="p-4 rounded-xl border border-rose-100 dark:border-rose-950/50 bg-rose-50/30 dark:bg-rose-950/20">
                <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Improvement Notes
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {feedback.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1e1e1e] flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Review Code
          </Button>

          <div className="flex items-center gap-2">
            {onNextQuestion ? (
              <Button
                size="sm"
                onClick={onNextQuestion}
                icon={ArrowRight}
                className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-stone-950 font-bold shadow-sm shadow-amber-500/25"
              >
                Next Problem
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={onClose}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              >
                Done
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
