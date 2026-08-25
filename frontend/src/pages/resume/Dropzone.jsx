import React, { useCallback, useState } from 'react';
import { UploadCloud, File as FileIcon, X, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const Dropzone = ({ onUpload, loading }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        alert('Please upload a PDF file.');
      }
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        alert('Please upload a PDF file.');
      }
    }
  };

  const handleSubmit = () => {
    if (selectedFile) onUpload(selectedFile);
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors flex flex-col items-center justify-center cursor-pointer ${
            isDragActive 
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' 
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-slate-800'
          }`}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <UploadCloud className={`w-12 h-12 mb-4 ${isDragActive ? 'text-indigo-500' : 'text-slate-400'}`} />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Upload your Resume
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Drag & drop your PDF file here, or click to browse
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Maximum file size: 5MB</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-full flex items-center justify-center mb-4">
            <FileIcon className="w-8 h-8" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-[250px]">
            {selectedFile.name}
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
          </p>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" onClick={() => setSelectedFile(null)} disabled={loading}>
              Change File
            </Button>
            <Button onClick={handleSubmit} disabled={loading} icon={loading ? Loader2 : null} className={loading ? '[&>svg]:animate-spin' : ''}>
              {loading ? 'Analyzing...' : 'Analyze Match'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

