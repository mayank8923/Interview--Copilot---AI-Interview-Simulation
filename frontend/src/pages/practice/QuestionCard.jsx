import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Users, Server, Brain } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'EASY': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';
    case 'MEDIUM': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800';
    case 'HARD': return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'TECHNICAL': return <Terminal className="w-5 h-5 text-indigo-500" />;
    case 'HR': return <Users className="w-5 h-5 text-violet-500" />;
    case 'SYSTEM_DESIGN': return <Server className="w-5 h-5 text-blue-500" />;
    default: return <Brain className="w-5 h-5 text-slate-500" />;
  }
};

export const QuestionCard = ({ question }) => {
  const navigate = useNavigate();

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer animate-fade-in" onClick={() => navigate(`/practice/${question.id}`)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
            {getTypeIcon(question.type)}
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
            {question.title}
          </h3>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getDifficultyColor(question.difficulty)}`}>
          {question.difficulty}
        </span>
      </div>

      {question.targetCompany && (
        <span className="inline-flex items-center text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md mb-3 w-fit">
          {question.targetCompany}
        </span>
      )}
      
      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-6 flex-grow">
        {question.content}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex gap-2 flex-wrap">
          {question.tags?.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="text-xs bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">
              {tag}
            </span>
          ))}
          {(question.tags?.length || 0) > 2 && (
            <span className="text-xs text-slate-500">+{question.tags.length - 2}</span>
          )}
        </div>
        <Button size="sm" onClick={() => navigate(`/practice/${question.id}`)}>
          Practice
        </Button>
      </div>
    </div>
  );
};

