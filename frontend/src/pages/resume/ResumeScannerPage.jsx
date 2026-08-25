import React, { useState, useEffect } from 'react';
import { getLatestResumeAnalysis, uploadResume } from '../../api/resumeApi';
import { Dropzone } from './Dropzone';
import { ResumeScorecard } from './ResumeScorecard';
import { FileText, Loader2 } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

export const ResumeScannerPage = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-indigo-500" />
            Resume Alignment Scanner
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Upload your resume to see how well it matches your target role: <strong className="text-indigo-600">{user?.targetRole || 'Not set'}</strong>
          </p>
        </div>

        <Dropzone onUpload={handleUpload} loading={uploading} />

        {analysis && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700 pb-2">
              Latest Analysis Results
            </h2>
            <ResumeScorecard analysis={analysis} />
          </div>
        )}

      </div>
    </div>
  );
};

