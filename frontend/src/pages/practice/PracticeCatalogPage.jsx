import React, { useState, useEffect } from 'react';
import { getQuestions } from '../../api/questionsApi';
import { QuestionCard } from './QuestionCard';
import { Button } from '../../components/ui/Button';
import { Search, Filter, Loader2, Building2, Layers, BookOpen, X, Sparkles } from 'lucide-react';

const TOPIC_PILLS = [
  { label: 'All Topics', value: '' },
  { label: 'Core Algorithms', value: 'Array' },
  { label: 'Java & Spring', value: 'Java' },
  { label: 'React & Web', value: 'React' },
  { label: 'System Design', value: 'System Design' },
  { label: 'Database & SQL', value: 'Database' },
  { label: 'Python & AI', value: 'Python' },
  { label: 'Behavioral (STAR)', value: 'Behavioral' },
];

export const PracticeCatalogPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterType, setFilterType] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await getQuestions(filterType, filterDifficulty);
      setQuestions(data || []);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [filterType, filterDifficulty]);

  // Multi-tier client filtering
  const filteredQuestions = questions.filter((q) => {
    // Company match (checks if selected company is inside comma-separated targetCompany)
    if (filterCompany) {
      const compLower = filterCompany.toLowerCase();
      const qComp = (q.targetCompany || '').toLowerCase();
      if (!qComp.includes(compLower)) return false;
    }

    // Topic pill match
    if (selectedTopic) {
      const topicLower = selectedTopic.toLowerCase();
      const inTopic = q.topic && q.topic.toLowerCase().includes(topicLower);
      const inTags = q.tags && q.tags.some(t => t.toLowerCase().includes(topicLower));
      if (!inTopic && !inTags) return false;
    }

    // Search query match
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const inTitle = q.title && q.title.toLowerCase().includes(term);
      const inContent = q.content && q.content.toLowerCase().includes(term);
      const inTags = q.tags && q.tags.some(t => t.toLowerCase().includes(term));
      const inCompany = q.targetCompany && q.targetCompany.toLowerCase().includes(term);
      const inTopic = q.topic && q.topic.toLowerCase().includes(term);
      if (!inTitle && !inContent && !inTags && !inCompany && !inTopic) return false;
    }

    return true;
  });

  return (
    <div className="flex-1 bg-[#fbf9f6] dark:bg-[#0c0d0f] py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#131418] p-6 rounded-2xl border border-stone-200/90 dark:border-stone-800/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                <Sparkles className="w-3 h-3 text-amber-500" /> FAANG & Top Tech Ready
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 dark:bg-[#1c1d24] text-stone-700 dark:text-stone-300">
                {questions.length} Problems
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Practice Question Bank
            </h1>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
              Interactive coding workspace with automated test cases, real-time AI evaluation, and progressive hints.
            </p>
          </div>
        </div>

        {/* Search & Topic Pill Bar */}
        <div className="space-y-4">
          {/* Search and Dropdown Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search problem title, algorithm, company, tags..."
                className="w-full bg-white dark:bg-[#131418] border border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-stone-100 py-2.5 pl-10 pr-9 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm placeholder-stone-400"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Company Dropdown */}
            <div className="relative">
              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-[#131418] border border-stone-200/90 dark:border-stone-800 text-stone-800 dark:text-stone-200 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm text-sm font-medium"
              >
                <option value="">All Companies</option>
                <optgroup label="FAANG & Global">
                  <option value="Google">Google</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Meta">Meta</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Apple">Apple</option>
                  <option value="Netflix">Netflix</option>
                  <option value="Oracle">Oracle</option>
                  <option value="Adobe">Adobe</option>
                  <option value="Uber">Uber</option>
                </optgroup>
                <optgroup label="High Growth">
                  <option value="Spotify">Spotify</option>
                  <option value="Airbnb">Airbnb</option>
                  <option value="Bloomberg">Bloomberg</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Salesforce">Salesforce</option>
                </optgroup>
              </select>
              <Building2 className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
            </div>

            {/* Difficulty Dropdown */}
            <div className="relative">
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-[#131418] border border-stone-200/90 dark:border-stone-800 text-stone-800 dark:text-stone-200 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm text-sm font-medium"
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
              <Filter className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Quick Filter Topic Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Topic:
            </span>
            {TOPIC_PILLS.map((pill) => {
              const isSelected = selectedTopic === pill.value;
              return (
                <button
                  key={pill.label}
                  onClick={() => setSelectedTopic(pill.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-stone-950 font-bold shadow-sm shadow-amber-500/25'
                      : 'bg-white dark:bg-[#131418] text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#1a1b20] border border-stone-200/90 dark:border-stone-800'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Cards Grid */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-3" />
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Loading questions from bank...</p>
          </div>
        ) : filteredQuestions.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Showing {filteredQuestions.length} {filteredQuestions.length === 1 ? 'problem' : 'problems'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredQuestions.map((q) => (
                <QuestionCard key={q.id || q.title} question={q} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-14 bg-white dark:bg-[#131418] rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 shadow-sm">
            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white">No matching questions found</h3>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400 max-w-sm">
              We couldn't find any questions matching your current filters. Try resetting your search or selecting different topics.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedTopic('');
                setFilterCompany('');
                setFilterType('');
                setFilterDifficulty('');
              }}
              className="mt-5"
            >
              Reset All Filters
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};
