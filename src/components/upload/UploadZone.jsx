import React, { useState, useCallback } from 'react';
import { noteshareApi } from '@/api/noteshareApi';
import { FileUp, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

export default function UploadZone({ onFileUploaded }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleUpload = useCallback(async (file) => {
    if (!file) return;
    setUploading(true);
    setFileName(file.name);
    try {
      const { file_url } = await noteshareApi.uploads.file(file);
      setUploaded(true);
      onFileUploaded(file_url, file.name);
    } catch (error) {
      setUploaded(false);
      toast({
        variant: 'destructive',
        title: 'File upload failed',
        description: error?.message || 'Could not upload this file. Please try again.',
      });
    } finally {
      setUploading(false);
    }
  }, [onFileUploaded]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleUpload(file);
  }, [handleUpload]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleUpload(file);
  };

  return (
    <motion.div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer
        ${dragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border hover:border-primary/40 hover:bg-muted/50'}
        ${uploaded ? 'border-accent bg-accent/5' : ''}
      `}
      onClick={() => !uploading && document.getElementById('file-input').click()}
    >
      <input
        id="file-input"
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.png,.jpg,.jpeg"
        onChange={handleFileSelect}
      />

      <AnimatePresence mode="wait">
        {uploading ? (
          <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Uploading {fileName}...</p>
          </motion.div>
        ) : uploaded ? (
          <motion.div key="uploaded" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Check className="w-6 h-6 text-accent" />
            </div>
            <p className="text-sm font-medium">{fileName}</p>
            <p className="text-xs text-muted-foreground">File uploaded successfully. Click to replace.</p>
          </motion.div>
        ) : (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <FileUp className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="font-medium">Drag & drop your notes here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse • PDF, DOCX, PPTX, images</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
