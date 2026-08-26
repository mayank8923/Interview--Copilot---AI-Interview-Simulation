import React, { useState, useEffect } from 'react';
import { getQuestions } from '../../api/questionsApi';
import { QuestionCard } from './QuestionCard';
import { Search, Filter, Loader2, Building2 } from 'lucide-react';

export const PracticeCatalogPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterCompany, setFilterCompany] = useState('');

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await getQuestions(filterType, filterDifficulty);
      setQuestions(data);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [filterType, filterDifficulty]);

  // Client-side filter for company (since backend already returns all)
  const filteredQuestions = filterCompany
    ? questions.filter(q => q.targetCompany === filterCompany)
    : questions;

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Practice Bank</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {filteredQuestions.length} questions available — Sharpen your skills for FAANG-level interviews.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Company Filter */}
            <div className="relative">
              <select 
                value={filterCompany} 
                onChange={(e) => setFilterCompany(e.target.value)}
                className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm font-medium"
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
                  <option value="Salesforce">Salesforce</option>
                  <option value="Uber">Uber</option>
                  <option value="Goldman Sachs">Goldman Sachs</option>
                  <option value="Morgan Stanley">Morgan Stanley</option>
                  <option value="JP Morgan">JP Morgan</option>
                </optgroup>
                <optgroup label="Indian IT Services">
                  <option value="TCS">TCS</option>
                  <option value="Infosys">Infosys</option>
                  <option value="Wipro">Wipro</option>
                  <option value="HCL Technologies">HCL Technologies</option>
                  <option value="Tech Mahindra">Tech Mahindra</option>
                  <option value="Cognizant">Cognizant</option>
                  <option value="LTIMindtree">LTIMindtree</option>
                  <option value="Capgemini India">Capgemini India</option>
                </optgroup>
                <optgroup label="Indian Product & Startups">
                  <option value="Flipkart">Flipkart</option>
                  <option value="Paytm">Paytm</option>
                  <option value="Zomato">Zomato</option>
                  <option value="Swiggy">Swiggy</option>
                  <option value="Razorpay">Razorpay</option>
                  <option value="PhonePe">PhonePe</option>
                  <option value="CRED">CRED</option>
                  <option value="Zerodha">Zerodha</option>
                  <option value="Ola">Ola</option>
                  <option value="Dream11">Dream11</option>
                  <option value="Freshworks">Freshworks</option>
                  <option value="Zoho">Zoho</option>
                  <option value="Myntra">Myntra</option>
                  <option value="BrowserStack">BrowserStack</option>
                </optgroup>
                <option value="General">General</option>
              </select>
              <Building2 className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm font-medium"
              >
                <option value="">All Categories</option>
                <option value="TECHNICAL">Technical & DSA</option>
                <option value="SYSTEM_DESIGN">System Design</option>
                <option value="HR">Behavioral / HR</option>
              </select>
              <Filter className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>

            {/* Difficulty Filter */}
            <div className="relative">
              <select 
                value={filterDifficulty} 
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm font-medium"
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
              <Filter className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : filteredQuestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuestions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <Search className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No questions found</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              We couldn't find any questions matching your current filters. Try adjusting the category or difficulty.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
