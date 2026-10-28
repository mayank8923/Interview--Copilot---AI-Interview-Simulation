import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, Loader2, Code2, Users, AlertCircle, FileText, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { startMockSession } from '../../api/mockApi';

export const MockSetupModal = ({ isOpen, onClose, initialUseResume = false, initialRole }) => {
  const [role, setRole] = useState(initialRole || 'Fullstack Developer');
  const [company, setCompany] = useState('Google');
  const [topic, setTopic] = useState('System Design');
  const [type, setType] = useState('TECHNICAL');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [duration, setDuration] = useState(15);
  const [customPrompt, setCustomPrompt] = useState('');
  
  const [useResume, setUseResume] = useState(initialUseResume);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (initialUseResume) setUseResume(true);
    if (initialRole) setRole(initialRole);
  }, [isOpen, initialUseResume, initialRole]);

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
        customPrompt,
        useResume
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#131418] rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800/80 bg-stone-50/80 dark:bg-[#16171d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-stone-950 font-bold shadow-sm shadow-amber-500/20">
              <Sparkles className="w-5 h-5 fill-stone-950" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-white tracking-tight">
                AI Mock Interview Setup
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Generate live, company-calibrated technical questions on demand.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#1f2026] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleStart} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">Target Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-stone-50 dark:bg-[#101114] border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium">
                <option value="Fullstack Developer">Fullstack Developer</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                <option value="System Architect">System Architect</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">Target Company</label>
              <select value={company} onChange={(e) => setCompany(e.target.value)} className="w-full bg-stone-50 dark:bg-[#101114] border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium">
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
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">Core Topic / Skill</label>
              <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-stone-50 dark:bg-[#101114] border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium">
                <option value="System Design">System Design</option>
                <option value="Algorithms & Data Structures">Algorithms & Data Structures</option>
                <option value="Spring Boot & Java">Spring Boot & Java</option>
                <option value="React & Frontend">React & Frontend</option>
                <option value="Behavioral / STAR">Behavioral / STAR</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">Question Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-stone-50 dark:bg-[#101114] border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium">
                <option value="TECHNICAL">Technical & Coding</option>
                <option value="SYSTEM_DESIGN">System Design</option>
                <option value="HR">Behavioral (HR)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {['EASY', 'MEDIUM', 'HARD'].map((d) => (
                  <button key={d} type="button" onClick={() => setDifficulty(d)} className={`py-2 text-xs font-bold rounded-xl border transition-all ${difficulty === d ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-sm' : 'bg-stone-50 dark:bg-[#18191f] border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-500/50'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">Duration</label>
              <div className="grid grid-cols-2 gap-2">
                {[15, 30].map((num) => (
                  <button key={num} type="button" onClick={() => setDuration(num)} className={`py-2 text-xs font-bold rounded-xl border transition-all ${duration === num ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 border-amber-500 shadow-sm' : 'bg-stone-50 dark:bg-[#18191f] border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-500/50'}`}>
                    {num} Min ({num/15 * 2} Qs)
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">Custom Context (Optional)</label>
            <textarea rows={2} value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="E.g., 'Focus on high-throughput Kafka streaming or Redis caching'" className="w-full bg-stone-50 dark:bg-[#101114] border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>

          {/* Resume Tailoring Toggle */}
          <div className="flex items-center justify-between p-4 bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/30 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-sm">
                <FileText className="w-4 h-4 fill-stone-950" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white">Tailor to my uploaded Resume</span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">AI generates questions probing your real past projects & systems.</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-3 shrink-0">
              <input type="checkbox" className="sr-only peer" checked={useResume} onChange={(e) => setUseResume(e.target.checked)} />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-amber-400 peer-checked:to-orange-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading} className="text-xs font-semibold">Cancel</Button>
            <Button type="submit" size="sm" disabled={loading} className="text-xs font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-stone-950 shadow-md shadow-amber-500/20 border-0">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating AI Interview...</> : <><Play className="w-4 h-4 mr-2 fill-current" /> Start AI Mock Session</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
