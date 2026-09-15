import React, { useState, useEffect } from 'react';
import { getQuestions } from '../../api/questionsApi';
import { QuestionCard } from './QuestionCard';
import { Button } from '../../components/ui/Button';
import { Search, Filter, Loader2, Building2, Layers, BookOpen } from 'lucide-react';

const TOPIC_PILLS = [
  { label: 'All Topics', value: '' },
  { label: 'Java & Spring Boot', value: 'Java' },
  { label: 'React & Frontend', value: 'React' },
  { label: 'System Design', value: 'System Design' },
  { label: 'Database & SQL', value: 'Database' },
  { label: 'DevOps & Cloud', value: 'DevOps' },
  { label: 'Python & AI / ML', value: 'Python & AI' },
  { label: 'Behavioral (STAR)', value: 'Behavioral' },
  { label: 'Core Algorithms', value: 'Array' },
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
    // Company match
    if (filterCompany && q.targetCompany !== filterCompany) return false;

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
    <div className="flex-1 bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col h-full space-y-6">
        
        {/* Header Bar with Stats and AI Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                FAANG & Enterprise Ready
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                {questions.length} Total Questions
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Interview Practice Catalog
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Master technical architectures, real-world system designs, and STAR behavioral scenarios.
            </p>
          </div>

          <div className="flex items-center gap-3">
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
                placeholder="Search by keyword, technology, problem title, or tags..."
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 py-2.5 pl-10 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>

            {/* Company Dropdown */}
            <div className="relative">
              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm font-medium"
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
                  <option value="Goldman Sachs">Goldman Sachs</option>
                </optgroup>
                <optgroup label="Indian Tech & Startups">
                  <option value="Flipkart">Flipkart</option>
                  <option value="Razorpay">Razorpay</option>
                  <option value="Swiggy">Swiggy</option>
                  <option value="Zomato">Zomato</option>
                  <option value="CRED">CRED</option>
                  <option value="TCS">TCS</option>
                  <option value="Infosys">Infosys</option>
                </optgroup>
                <option value="General">General</option>
              </select>
              <Building2 className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>

            {/* Difficulty Dropdown */}
            <div className="relative">
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm font-medium"
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
              <Filter className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Quick Filter Topic Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Domain:
            </span>
            {TOPIC_PILLS.map((pill) => (
              <button
                key={pill.label}
                onClick={() => setSelectedTopic(pill.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedTopic === pill.value
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question Cards Grid */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading questions from database...</p>
          </div>
        ) : filteredQuestions.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Showing {filteredQuestions.length} {filteredQuestions.length === 1 ? 'question' : 'questions'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuestions.map((q) => (
                <QuestionCard key={q.id || q.title} question={q} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 shadow-sm">
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No matching questions found</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
              We couldn't find any questions matching your current filters or search term. Try switching filters or generate brand new ones with AI!
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedTopic('');
                setFilterCompany('');
                setFilterType('');
                setFilterDifficulty('');
              }}
              className="mt-6"
            >
              Reset All Filters
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};
