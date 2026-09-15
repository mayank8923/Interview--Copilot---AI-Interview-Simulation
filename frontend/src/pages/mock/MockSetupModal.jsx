import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, Loader2, Code2, Users, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { startMockSession } from '../../api/mockApi';

export const MockSetupModal = ({ isOpen, onClose }) => {
  const [role, setRole] = useState('Fullstack Developer');
  const [company, setCompany] = useState('Google');
  const [topic, setTopic] = useState('System Design');
  const [type, setType] = useState('TECHNICAL');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [duration, setDuration] = useState(15);
  const [customPrompt, setCustomPrompt] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleStart = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const payload = {
        role,
        company,
        topic,
        type,
        difficulty,
        durationMinutes: duration,
        customPrompt
      };
      
      const session = await startMockSession(payload);
      navigate(`/mock/room/${session.sessionId}`);
    } catch (err) {
      console.error('Failed to start mock session', err);
      setError(err?.response?.data?.message || err.message || 'Failed to start session.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-white dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-slate-900">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              AI Mock Interview Setup
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate custom, live FAANG-level questions on demand for this session.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleStart} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Target Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium">
                <option value="Fullstack Developer">Fullstack Developer</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                <option value="System Architect">System Architect</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Target Company</label>
              <select value={company} onChange={(e) => setCompany(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium">
                <option value="Google">Google</option>
                <option value="Amazon">Amazon</option>
                <option value="Meta">Meta</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Netflix">Netflix</option>
                <option value="General">General / Tech Startup</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Core Topic / Skill</label>
              <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium">
                <option value="System Design">System Design</option>
                <option value="Algorithms & Data Structures">Algorithms & Data Structures</option>
                <option value="Spring Boot & Java">Spring Boot & Java</option>
                <option value="React & Frontend">React & Frontend</option>
                <option value="Behavioral / STAR">Behavioral / STAR</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Question Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium">
                <option value="TECHNICAL">Technical & Coding</option>
                <option value="SYSTEM_DESIGN">System Design</option>
                <option value="HR">Behavioral (HR)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {['EASY', 'MEDIUM', 'HARD'].map((d) => (
                  <button key={d} type="button" onClick={() => setDifficulty(d)} className={`py-2 text-xs font-bold rounded-xl border transition-all ${difficulty === d ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Duration</label>
              <div className="grid grid-cols-2 gap-2">
                {[15, 30].map((num) => (
                  <button key={num} type="button" onClick={() => setDuration(num)} className={`py-2 text-xs font-bold rounded-xl border transition-all ${duration === num ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400'}`}>
                    {num} Min ({num/15 * 2} Qs)
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Custom Context (Optional)</label>
            <textarea rows={2} value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="E.g., 'Focus on high-throughput Kafka streaming'" className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={loading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating AI Interview...</> : <><Play className="w-4 h-4 mr-2" /> Start AI Mock Session</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
