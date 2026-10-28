import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Mic, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Briefcase, 
  Award,
  Layers
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ResumeScorecard = ({ analysis, onOpenMock }) => {
  const navigate = useNavigate();
  if (!analysis) return null;

  const isGood = analysis.matchScore >= 75;
  const isOk = analysis.matchScore >= 50 && analysis.matchScore < 75;

  const handleStartVoiceRound = () => {
    navigate('/chat-interview?useResume=true');
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Card */}
      <div className="bg-white dark:bg-[#131418] rounded-3xl border border-stone-200/90 dark:border-stone-800/80 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8 shadow-sm">
        
        {/* Match Gauge */}
        <div className="relative flex items-center justify-center w-36 h-36 shrink-0">
          <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-xl animate-pulse" />
          <svg className="w-full h-full transform -rotate-90 relative z-10">
            <circle cx="72" cy="72" r="62" className="stroke-stone-100 dark:stroke-stone-800" strokeWidth="12" fill="none" />
            <circle 
              cx="72" 
              cy="72" 
              r="62" 
              className={`transition-all duration-1000 ease-out ${
                isGood ? 'stroke-emerald-500' : isOk ? 'stroke-amber-500' : 'stroke-rose-500'
              }`} 
              strokeWidth="12" 
              fill="none" 
              strokeDasharray="389.5"
              strokeDashoffset={389.5 - (389.5 * analysis.matchScore) / 100}
              strokeLinecap="round" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <span className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
              {analysis.matchScore}%
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Alignment
            </span>
          </div>
        </div>

        {/* Overview Assessment */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Target: {analysis.targetRole}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            {isGood ? 'High Profile Match for this Role' : 
             isOk ? 'Moderate Match with Growth Potential' : 
             'Key Skill Gaps Detected for Target Role'}
          </h3>
          
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-xl">
            {isGood ? 'Your resume showcases strong technical competencies and project experience. You are well-positioned to tackle interview rounds for this position.' : 
             isOk ? 'Your core experience aligns with the basics, but adding targeted architectural keywords and metrics will boost ATS screening rates.' : 
             'Noticeable keyword and technical domain gaps were identified. Review the missing competencies and practice tailored interview questions below.'}
          </p>
        </div>
      </div>

      {/* 🚀 Resume-Tailored Interview Action Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 rounded-3xl border border-amber-500/25 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white">
                Practice With Your Real Resume Projects
              </h4>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 max-w-xl leading-relaxed">
              Let the AI interrogate you on your actual past systems, technical trade-offs, and project responsibilities extracted from this PDF.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              onClick={handleStartVoiceRound}
              size="sm"
              className="text-xs font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-stone-950 shadow-md shadow-amber-500/20 gap-1.5"
            >
              <Mic className="w-4 h-4 fill-stone-950" />
              <span>Voice Interview on Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>

            {onOpenMock && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenMock}
                className="text-xs font-bold gap-1.5 border-stone-300 dark:border-stone-700 hover:border-amber-500/50"
              >
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Timed Mock Round</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Matched vs Missing Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Matched */}
        <div className="bg-white dark:bg-[#131418] rounded-3xl border border-emerald-500/20 dark:border-emerald-500/20 p-6 space-y-3 shadow-sm">
          <h4 className="text-xs font-extrabold flex items-center gap-2 text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Matched Competencies ({analysis.matchedKeywords?.length || 0})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {analysis.matchedKeywords?.map((kw, i) => (
              <span 
                key={i} 
                className="px-2.5 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-semibold rounded-lg"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Missing */}
        <div className="bg-white dark:bg-[#131418] rounded-3xl border border-amber-500/20 dark:border-amber-500/20 p-6 space-y-3 shadow-sm">
          <h4 className="text-xs font-extrabold flex items-center gap-2 text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-amber-500" /> Recommended Keywords ({analysis.missingKeywords?.length || 0})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {analysis.missingKeywords?.map((kw, i) => (
              <span 
                key={i} 
                className="px-2.5 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-xs font-semibold rounded-lg"
              >
                + {kw}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Actionable Suggestions */}
      <div className="bg-white dark:bg-[#131418] rounded-3xl border border-stone-200/90 dark:border-stone-800/80 p-6 space-y-4 shadow-sm">
        <h4 className="text-xs font-extrabold flex items-center gap-2 text-stone-900 dark:text-white uppercase tracking-wider">
          <TrendingUp className="w-4 h-4 text-amber-500" /> Actionable Resume Enhancements
        </h4>
        <ul className="space-y-2.5">
          {analysis.suggestions?.map((s, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

