import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, Clock, Code2, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { startMockSession } from '../../api/mockApi';

export const MockSetupModal = ({ isOpen, onClose }) => {
  const [duration, setDuration] = useState(15);
  const [type, setType] = useState('TECHNICAL');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleStart = async () => {
    try {
      setLoading(true);
      const session = await startMockSession(type, duration);
      navigate(`/mock/room/${session.sessionId}`);
    } catch (err) {
      console.error('Failed to start mock session', err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">New Mock Interview</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Interview Focus</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setType('TECHNICAL')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-colors ${type === 'TECHNICAL' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}
              >
                <Code2 className="w-6 h-6" />
                <span className="text-sm font-semibold">Technical / DSA</span>
              </button>
              <button 
                onClick={() => setType('HR')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-colors ${type === 'HR' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}
              >
                <Users className="w-6 h-6" />
                <span className="text-sm font-semibold">HR / Behavioral</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Duration</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setDuration(15)}
                className={`px-4 py-3 rounded-xl border flex items-center justify-center gap-2 transition-colors ${duration === 15 ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}
              >
                <Clock className="w-4 h-4" />
                <span className="font-medium">15 Min (2 Qs)</span>
              </button>
              <button 
                onClick={() => setDuration(30)}
                className={`px-4 py-3 rounded-xl border flex items-center justify-center gap-2 transition-colors ${duration === 30 ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}
              >
                <Clock className="w-4 h-4" />
                <span className="font-medium">30 Min (3 Qs)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button icon={Play} onClick={handleStart} disabled={loading}>Start Session</Button>
        </div>

      </div>
    </div>
  );
};

