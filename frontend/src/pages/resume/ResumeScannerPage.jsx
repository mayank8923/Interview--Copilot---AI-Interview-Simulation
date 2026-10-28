import React, { useState, useEffect } from 'react';
import { getLatestResumeAnalysis, uploadResume } from '../../api/resumeApi';
import { Dropzone } from './Dropzone';
import { ResumeScorecard } from './ResumeScorecard';
import { MockSetupModal } from '../mock/MockSetupModal';
import { FileText, Loader2, Sparkles } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

export const ResumeScannerPage = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isMockModalOpen, setIsMockModalOpen] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await getLatestResumeAnalysis();
        if (data) setAnalysis(data);
      } catch (err) {
        console.error('Failed to fetch resume analysis', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const handleUpload = async (file) => {
    try {
      setUploading(true);
      const data = await uploadResume(file);
      setAnalysis(data);
    } catch (err) {
      console.error('Failed to upload resume', err);
      alert(`Upload Failed: ${err.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fbf9f6] dark:bg-[#0c0d0f] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <span className="text-xs font-semibold text-stone-500">Checking resume status...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#fbf9f6] dark:bg-[#0c0d0f] py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-stone-950 font-bold shadow-md shadow-amber-500/20">
              <FileText className="w-5 h-5 fill-stone-950" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                Resume Alignment & Interview Prep
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                Analyze your PDF resume against your target role: <strong className="text-amber-600 dark:text-amber-400 font-semibold">{user?.targetRole || 'Software Engineer'}</strong>
              </p>
            </div>
          </div>
        </div>

        <Dropzone onUpload={handleUpload} loading={uploading} />

        {analysis && (
          <div className="mt-12 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className="text-lg font-extrabold text-stone-900 dark:text-white tracking-tight">
                  AI Alignment Evaluation
                </h2>
              </div>
              <span className="text-xs text-stone-400">
                Role: <strong className="text-stone-700 dark:text-stone-300">{analysis.targetRole}</strong>
              </span>
            </div>
            
            <ResumeScorecard 
              analysis={analysis} 
              onOpenMock={() => setIsMockModalOpen(true)} 
            />
          </div>
        )}

      </div>

      <MockSetupModal 
        isOpen={isMockModalOpen} 
        onClose={() => setIsMockModalOpen(false)} 
        initialUseResume={true}
        initialRole={analysis?.targetRole || user?.targetRole || 'Fullstack Developer'}
      />
    </div>
  );
};

