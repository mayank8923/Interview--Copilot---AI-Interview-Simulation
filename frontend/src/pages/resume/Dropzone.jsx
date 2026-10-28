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
          className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
            isDragActive 
              ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/10' 
              : 'border-stone-200 dark:border-stone-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 bg-white dark:bg-[#131418]'
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
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white mb-1.5">
            Upload your Resume (PDF)
          </h3>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
            Drag & drop your PDF file here, or click to browse
          </p>
          <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-2">Maximum file size: 5MB</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#131418] rounded-3xl border border-stone-200 dark:border-stone-800 p-6 flex flex-col items-center shadow-sm">
          <div className="w-16 h-16 bg-amber-500/15 text-amber-500 rounded-2xl flex items-center justify-center mb-4">
            <FileIcon className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-stone-900 dark:text-white line-clamp-1 max-w-[250px]">
            {selectedFile.name}
          </h3>
          <p className="text-xs text-stone-500 mb-5">
            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
          </p>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={() => setSelectedFile(null)} disabled={loading}>
              Change File
            </Button>
            <Button 
              size="sm"
              onClick={handleSubmit} 
              disabled={loading} 
              icon={loading ? Loader2 : null} 
              className={`bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-stone-950 font-bold shadow-sm ${loading ? '[&>svg]:animate-spin' : ''}`}
            >
              {loading ? 'AI Analyzing...' : 'Analyze Match'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

