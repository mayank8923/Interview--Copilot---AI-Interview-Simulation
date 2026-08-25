import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionById, submitPracticeAnswer } from '../../api/questionsApi';
import { AiFeedbackDrawer } from './AiFeedbackDrawer';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const PracticeWorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const data = await getQuestionById(id);
        setQuestion(data);
      } catch (err) {
        console.error('Failed to load question', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    try {
      setSubmitting(true);
      const data = await submitPracticeAnswer(id, answer);
      setFeedback(data);
    } catch (err) {
      console.error('Failed to submit answer', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500">
        <p>Question not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/practice')}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white dark:bg-slate-900 relative">
      
      {/* Left Pane: Question */}
      <div className="w-full md:w-1/3 lg:w-2/5 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10">
          <button onClick={() => navigate('/practice')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {question.difficulty}
          </span>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
            {question.type}
          </span>
        </div>
        
        <div className="p-6 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{question.title}</h2>
          <ReactMarkdown>{question.content}</ReactMarkdown>
        </div>
      </div>

      {/* Right Pane: Editor */}
      <div className="w-full md:w-2/3 lg:w-3/5 flex flex-col h-[50vh] md:h-auto">
        <div className="flex-1 p-4 flex flex-col bg-slate-50 dark:bg-[#0d1117]">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer or code here..."
            className="flex-1 w-full bg-transparent resize-none outline-none font-mono text-sm text-slate-800 dark:text-slate-300 placeholder-slate-400"
            spellCheck="false"
          />
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
          <Button 
            onClick={handleSubmit} 
            disabled={!answer.trim() || submitting}
            icon={submitting ? Loader2 : Send}
            className={submitting ? '[&>svg]:animate-spin' : ''}
          >
            {submitting ? 'Analyzing...' : 'Submit to AI'}
          </Button>
        </div>
      </div>

      {/* Slide-up Feedback */}
      <AiFeedbackDrawer feedback={feedback} onClose={() => setFeedback(null)} />
    </div>
  );
};

