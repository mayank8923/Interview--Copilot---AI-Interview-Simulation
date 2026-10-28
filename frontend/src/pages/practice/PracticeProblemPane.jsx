import React, { useState } from 'react';
import { 
  FileText, 
  Lightbulb, 
  History, 
  ArrowLeft, 
  Tag, 
  Building2, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Cpu, 
  Sparkles,
  Code2,
  Shuffle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Progressive hints generator for common problem patterns
const getPrecomputedHints = (title = '', topic = '') => {
  const t = title.toLowerCase();
  if (t.includes('two sum')) {
    return [
      { id: 1, title: 'Hint 1: Brute Force vs Optimal', content: 'A brute force approach would search all pairs in O(n²) time. Can we do it in a single pass?' },
      { id: 2, title: 'Hint 2: Hash Map Lookup', content: 'As you iterate through nums, check if (target - num) is already in a Hash Map. If it is, you found the answer!' },
      { id: 3, title: 'Hint 3: Space vs Time Tradeoff', content: 'By storing each number and its index in a Hash Map, you achieve O(n) time complexity with O(n) space.' }
    ];
  }
  if (t.includes('palindrome')) {
    return [
      { id: 1, title: 'Hint 1: Two Pointers', content: 'Try using two pointers: one starting from the beginning (left) and one from the end (right).' },
      { id: 2, title: 'Hint 2: Sanitization', content: 'Remember to ignore non-alphanumeric characters and treat uppercase and lowercase letters as equal.' },
      { id: 3, title: 'Hint 3: Termination Condition', content: 'Move inward while left < right. If characters ever differ, it is not a palindrome!' }
    ];
  }
  return [
    { id: 1, title: 'Hint 1: Clarify Constraints', content: 'Consider the edge cases first: empty inputs, negative numbers, or single elements.' },
    { id: 2, title: 'Hint 2: Optimal Data Structure', content: `Think about how standard ${topic || 'algorithm'} structures (Hash Maps, Two Pointers, Stacks) apply here.` },
    { id: 3, title: 'Hint 3: Time Complexity Target', content: 'Can this problem be solved in linear O(N) or logarithmic O(log N) time rather than O(N²)?' }
  ];
};

export const PracticeProblemPane = ({
  question,
  submissions = [],
  onSelectSubmission,
  onBack,
  onPrevQuestion,
  onNextQuestion,
  onRandomQuestion,
  hasPrev = false,
  hasNext = false
}) => {
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'hints' | 'submissions'
  const [expandedHints, setExpandedHints] = useState({ 1: true });
  const [showAllCompanies, setShowAllCompanies] = useState(false);

  const toggleHint = (id) => {
    setExpandedHints(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const hints = getPrecomputedHints(question?.title, question?.topic);

  // Clean company list parsing
  const rawCompanies = (question?.targetCompany && question.targetCompany !== 'General')
    ? question.targetCompany.split(',').map(c => c.trim()).filter(Boolean)
    : [];
  const visibleCompanies = showAllCompanies ? rawCompanies : rawCompanies.slice(0, 3);
  const hiddenCompanyCount = rawCompanies.length - visibleCompanies.length;

  // Difficulty badge styling
  const getDifficultyBadge = (difficulty) => {
    const diff = (difficulty || 'MEDIUM').toUpperCase();
    if (diff === 'EASY') {
      return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60';
    }
    if (diff === 'HARD') {
      return 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60';
    }
    return 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#111215] overflow-hidden select-text border-r border-stone-200 dark:border-stone-800/80">
      {/* Top Problem Navigation Bar */}
      <div className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-[#16171c] flex flex-col shrink-0">
        
        {/* Navigation & Question Header */}
        <div className="px-3.5 py-2 flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800/80">
          <div className="flex items-center gap-1.5">
            {onBack && (
              <button 
                onClick={onBack}
                className="flex items-center gap-1 px-2.5 py-1 hover:bg-stone-200 dark:hover:bg-[#202127] rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 text-xs font-semibold transition-colors"
                title="Back to Problem Catalog"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Problems</span>
              </button>
            )}

            <div className="h-3.5 w-px bg-stone-300 dark:bg-stone-700 mx-1" />

            {/* Prev / Next / Random buttons */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={onPrevQuestion}
                disabled={!hasPrev}
                title="Previous Problem"
                className="p-1.5 hover:bg-stone-200 dark:hover:bg-[#202127] disabled:opacity-25 disabled:hover:bg-transparent rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onNextQuestion}
                disabled={!hasNext}
                title="Next Problem"
                className="p-1.5 hover:bg-stone-200 dark:hover:bg-[#202127] disabled:opacity-25 disabled:hover:bg-transparent rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {onRandomQuestion && (
                <button
                  onClick={onRandomQuestion}
                  title="Pick Random Problem"
                  className="p-1.5 hover:bg-stone-200 dark:hover:bg-[#202127] rounded-lg text-stone-500 hover:text-amber-500 dark:hover:text-amber-400 transition-colors ml-0.5"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${getDifficultyBadge(question?.difficulty)}`}>
              {question?.difficulty || 'Medium'}
            </span>
            {question?.type && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                {question.type}
              </span>
            )}
          </div>
        </div>

        {/* LeetCode Tabs: Description | Editorial / Hints | Submissions */}
        <div className="flex items-center px-2 bg-stone-100/50 dark:bg-[#131418]">
          <button
            onClick={() => setActiveTab('description')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'description'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200/40 dark:hover:bg-[#1a1b20]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Description</span>
          </button>

          <button
            onClick={() => setActiveTab('hints')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'hints'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200/40 dark:hover:bg-[#1a1b20]'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Editorial & Hints</span>
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'submissions'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200/40 dark:hover:bg-[#1a1b20]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Submissions</span>
            {submissions?.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                {submissions.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Pane Content */}
      <div className="flex-1 overflow-y-auto p-5 md:p-6 font-sans">
        
        {/* ================= TAB 1: DESCRIPTION ================= */}
        {activeTab === 'description' && (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-stone-900 dark:text-white tracking-tight mb-3">
                {question?.title}
              </h1>

              {/* Tags & Companies pills */}
              <div className="flex items-center flex-wrap gap-2 mb-2">
                {question?.topic && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                    <Tag className="w-3 h-3 text-amber-500" />
                    {question.topic}
                  </span>
                )}

                {/* Companies Clean Chips */}
                {rawCompanies.length > 0 && (
                  <div className="flex items-center flex-wrap gap-1.5">
                    {visibleCompanies.map((comp, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#191a20] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800"
                      >
                        <Building2 className="w-3 h-3 text-amber-500 shrink-0" />
                        {comp}
                      </span>
                    ))}
                    {hiddenCompanyCount > 0 && (
                      <button
                        onClick={() => setShowAllCompanies(true)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
                        title="View all companies"
                      >
                        +{hiddenCompanyCount} more
                      </button>
                    )}
                    {showAllCompanies && rawCompanies.length > 3 && (
                      <button
                        onClick={() => setShowAllCompanies(false)}
                        className="text-xs font-semibold px-2 py-1 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
                      >
                        Show less
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Markdown Problem Description */}
            <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed 
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-stone-900 dark:prose-headings:text-white
              prose-p:text-stone-700 dark:prose-p:text-stone-300 prose-p:leading-relaxed
              prose-code:font-mono prose-code:text-amber-600 dark:prose-code:text-amber-400 prose-code:bg-amber-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-[#141519] prose-pre:border prose-pre:border-stone-800/90 prose-pre:rounded-xl prose-pre:p-4 prose-pre:shadow-sm
              prose-ul:text-stone-700 dark:prose-ul:text-stone-300 prose-li:my-1"
            >
              <ReactMarkdown>{question?.content}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* ================= TAB 2: EDITORIAL & HINTS ================= */}
        {activeTab === 'hints' && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                Problem Hints & Strategy
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Progressive hints to guide you toward the optimal solution without spoiling it immediately.
              </p>
            </div>

            {/* Hints Accordion */}
            <div className="flex flex-col gap-3">
              {hints.map((hint) => {
                const isExpanded = !!expandedHints[hint.id];
                return (
                  <div 
                    key={hint.id}
                    className="border border-slate-200 dark:border-slate-800/90 rounded-xl overflow-hidden bg-white dark:bg-[#1c1d22] transition-colors"
                  >
                    <button
                      onClick={() => toggleHint(hint.id)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#22242a] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>{hint.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#18191e]">
                        {hint.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Complexity Guidance Card */}
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex flex-col gap-2 mt-2">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-amber-500" /> Recommended Complexity Target
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs mt-1">
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#15161a] border border-stone-200 dark:border-stone-800">
                  <span className="text-stone-500 block mb-0.5">Time Complexity</span>
                  <span className="font-mono font-semibold text-stone-800 dark:text-stone-200">O(N)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#15161a] border border-stone-200 dark:border-stone-800">
                  <span className="text-stone-500 block mb-0.5">Space Complexity</span>
                  <span className="font-mono font-semibold text-stone-800 dark:text-stone-200">O(N) or O(1)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: SUBMISSIONS ================= */}
        {activeTab === 'submissions' && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-amber-500" />
                Submission History
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Your recent evaluations and solutions for this problem.
              </p>
            </div>

            {submissions.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center text-center text-slate-400 gap-2">
                <Code2 className="w-8 h-8 text-slate-500 mb-1" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No submissions yet</p>
                <p className="text-xs text-slate-500 max-w-xs">
                  Run your code and click <strong className="text-slate-700 dark:text-slate-300">Submit</strong> to record your attempts and review your progress here.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {submissions.map((sub, idx) => {
                  const isAccepted = sub.status === 'Accepted' || sub.score >= 75;
                  return (
                    <div
                      key={sub.id || idx}
                      onClick={() => onSelectSubmission && onSelectSubmission(sub)}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#1c1d22] hover:border-indigo-500/50 cursor-pointer transition-all flex items-center justify-between group shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        {isAccepted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${isAccepted ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {sub.status || (isAccepted ? 'Accepted' : 'Wrong Answer')}
                            </span>
                            <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                              {sub.language || 'Java'}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {sub.timestamp || 'Just now'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-2">
                        {sub.runtime && (
                          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                            {sub.runtime}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
