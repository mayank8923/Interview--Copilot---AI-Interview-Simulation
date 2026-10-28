import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Users, Server, Brain, Building2, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const getDifficultyBadge = (difficulty) => {
  const diff = (difficulty || 'MEDIUM').toUpperCase();
  if (diff === 'EASY') {
    return {
      dot: 'bg-emerald-500',
      pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
    };
  }
  if (diff === 'HARD') {
    return {
      dot: 'bg-rose-500',
      pill: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/60'
    };
  }
  return {
    dot: 'bg-amber-500',
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/60'
  };
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'TECHNICAL': return <Terminal className="w-4 h-4 text-amber-500" />;
    case 'HR': return <Users className="w-4 h-4 text-orange-500" />;
    case 'SYSTEM_DESIGN': return <Server className="w-4 h-4 text-amber-600" />;
    default: return <Brain className="w-4 h-4 text-amber-400" />;
  }
};

export const QuestionCard = ({ question }) => {
  const navigate = useNavigate();

  // Parse comma-separated companies
  const companies = (question.targetCompany && question.targetCompany !== 'General')
    ? question.targetCompany.split(',').map(s => s.trim()).filter(Boolean)
    : [];
  const primaryCompany = companies[0];
  const remainingCompanyCount = companies.length - 1;

  const diffStyle = getDifficultyBadge(question.difficulty);

  return (
    <div 
      className="group bg-white dark:bg-[#131418] rounded-2xl border border-stone-200/90 dark:border-stone-800/80 p-5 shadow-sm hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-500/40 dark:hover:border-amber-500/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full cursor-pointer select-none"
      onClick={() => navigate(`/practice/${question.id}`)}
    >
      {/* Card Header: Type, Title, and Difficulty */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 bg-stone-100 dark:bg-[#1c1d24] rounded-xl shrink-0 group-hover:scale-105 transition-transform">
            {getTypeIcon(question.type)}
          </div>
          <h3 className="font-bold text-stone-900 dark:text-white text-base tracking-tight truncate group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
            {question.title}
          </h3>
        </div>

        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${diffStyle.pill}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${diffStyle.dot}`} />
          {question.difficulty || 'Medium'}
        </span>
      </div>

      {/* Company Badges */}
      {companies.length > 0 && (
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-stone-100 dark:bg-[#1a1b20] text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-md border border-stone-200/80 dark:border-stone-800">
            <Building2 className="w-3 h-3 text-amber-500" />
            {primaryCompany}
          </span>
          {remainingCompanyCount > 0 && (
            <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-[#1a1b20] px-1.5 py-0.5 rounded-md border border-stone-200/60 dark:border-stone-800/60">
              +{remainingCompanyCount} more
            </span>
          )}
        </div>
      )}
      
      {/* Question Snippet */}
      <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed mb-5 flex-grow">
        {question.content}
      </p>

      {/* Card Footer: Tags & Action Button */}
      <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/60 mt-auto">
        <div className="flex gap-1.5 flex-wrap">
          {question.topic && (
            <span className="text-[10px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/20">
              {question.topic}
            </span>
          )}
          {question.tags?.slice(0, 1).map((tag, idx) => (
            <span key={idx} className="text-[10px] font-medium bg-stone-100 dark:bg-[#1a1b20] text-stone-600 dark:text-stone-400 px-2 py-0.5 rounded-md border border-stone-200/50 dark:border-stone-800/50">
              {tag}
            </span>
          ))}
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/practice/${question.id}`);
          }}
          className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 group-hover:translate-x-0.5 transition-all"
        >
          <span>Practice</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
