import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMockSession, submitMockAnswer, finishMockSession } from '../../api/mockApi';
import { Button } from '../../components/ui/Button';
import { Clock, Loader2, ArrowRight, Flag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const InterviewRoomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Fake timer logic (e.g. 5 mins per question)
  const [timeLeft, setTimeLeft] = useState(5 * 60);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await getMockSession(id);
        if (data.status === 'COMPLETED') {
          navigate(`/mock/report/${id}`, { replace: true });
        } else {
          setSession(data);
          setTimeLeft(5 * 60); // Reset timer per question
        }
      } catch (err) {
        console.error('Failed to load session', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id, navigate]);

  useEffect(() => {
    if (!session || session.status === 'COMPLETED') return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNextQuestion(); // Auto-submit if time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [session]);

  const handleNextQuestion = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      const data = await submitMockAnswer(id, answer || 'No answer provided.');
      setAnswer('');
      if (data.currentQuestionIndex >= data.totalQuestions) {
        handleFinish();
      } else {
        setSession(data);
        setTimeLeft(5 * 60);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = async () => {
    try {
      setSubmitting(true);
      await finishMockSession(id);
      navigate(`/mock/report/${id}`, { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!session || !session.currentQuestion) return null;

  const isLastQuestion = session.currentQuestionIndex === session.totalQuestions - 1;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isTimeLow = timeLeft < 60;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
      
      {/* Header Bar */}
      <header className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="font-semibold text-slate-200">
            Interview in Progress (Q{session.currentQuestionIndex + 1}/{session.totalQuestions})
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 font-mono text-lg font-medium ${isTimeLow ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
            <Clock className="w-5 h-5" />
            {mins}:{secs.toString().padStart(2, '0')}
          </div>
          <Button variant="outline" size="sm" onClick={handleFinish} className="border-red-900/50 text-red-400 hover:bg-red-950/30 hover:border-red-500">
            End Early
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left: Question Area */}
        <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900">
          <div className="p-8 overflow-y-auto prose prose-invert max-w-none flex-1">
            <h2 className="text-2xl font-bold mb-6 text-white">{session.currentQuestion.title}</h2>
            <ReactMarkdown>{session.currentQuestion.content}</ReactMarkdown>
          </div>
        </div>

        {/* Right: Answer Area */}
        <div className="w-full md:w-1/2 flex flex-col bg-[#0d1117]">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here. If coding, use standard syntax. You will be evaluated when you proceed to the next question."
            className="flex-1 w-full bg-transparent resize-none outline-none font-mono text-sm text-slate-300 p-8 placeholder-slate-600"
            spellCheck="false"
            autoFocus
          />
          
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
            <Button 
              onClick={handleNextQuestion} 
              disabled={submitting}
              icon={isLastQuestion ? Flag : ArrowRight}
              className={submitting ? '[&>svg]:animate-spin' : ''}
            >
              {submitting ? 'Saving...' : isLastQuestion ? 'Finish Interview' : 'Next Question'}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

