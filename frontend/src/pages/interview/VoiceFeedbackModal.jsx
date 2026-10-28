import React from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  Lightbulb, 
  ArrowRight, 
  RotateCcw, 
  Bot, 
  TrendingUp, 
  MessageSquare, 
  Cpu, 
  Sparkles 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const VoiceFeedbackModal = ({ session, onClose, onRestart }) => {
  if (!session || !session.feedback) return null;

  const { feedback, persona, topic } = session;
  const isPassing = feedback.overallScore >= 70;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#131418] border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-[#16171d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-stone-950 shadow-md shadow-amber-500/20">
              <Award className="w-5 h-5 fill-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-white tracking-tight">
                  Interview Evaluation Scorecard
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {persona || 'Bar Raiser'}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Topic: <strong className="text-stone-700 dark:text-stone-300">{topic}</strong>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-[#1f2026] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Main Scorecard Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Overall Score */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
                Overall Rating
              </span>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-4xl font-black text-stone-900 dark:text-white">
                  {feedback.overallScore}
                </span>
                <span className="text-xs text-stone-400">/ 100</span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                isPassing 
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
              }`}>
                {isPassing ? 'Interview Ready' : 'Needs More Polish'}
              </span>
            </div>

            {/* Technical Score */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#18191f] border border-stone-200 dark:border-stone-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-amber-500" /> Technical
                </span>
                <span className="font-mono font-bold text-sm text-stone-800 dark:text-stone-200">
                  {feedback.technicalScore || feedback.overallScore}%
                </span>
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${feedback.technicalScore || feedback.overallScore}%` }}
                />
              </div>
              <span className="text-[11px] text-stone-400 mt-2 block">
                Architecture, depth & trade-offs
              </span>
            </div>

            {/* Communication Score */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#18191f] border border-stone-200 dark:border-stone-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-orange-500" /> Clarity
                </span>
                <span className="font-mono font-bold text-sm text-stone-800 dark:text-stone-200">
                  {feedback.communicationScore || feedback.overallScore}%
                </span>
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${feedback.communicationScore || feedback.overallScore}%` }}
                />
              </div>
              <span className="text-[11px] text-stone-400 mt-2 block">
                Speech structuring & conciseness
              </span>
            </div>

          </div>

          {/* AI Executive Summary */}
          {feedback.summary && (
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#18191f] border border-stone-200 dark:border-stone-800/80 space-y-1.5">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Evaluator Assessment
              </span>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                {feedback.summary}
              </p>
            </div>
          )}

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Strengths */}
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2.5">
              <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Key Strengths
              </h4>
              <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                {feedback.strengths?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2.5">
              <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Growth Areas
              </h4>
              <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                {feedback.improvements?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-[#16171d] flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRestart}
            className="text-xs font-semibold gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Practice Another Topic</span>
          </Button>

          <Button 
            size="sm" 
            onClick={onClose}
            className="text-xs font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-stone-950 shadow-sm"
          >
            <span>Review Full Transcript</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

      </div>
    </div>
  );
};

