import React, { useState } from 'react';
import { noteshareApi } from '@/api/noteshareApi';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UploadZone from '../components/upload/UploadZone';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

const SCHOOLS = ['SP', 'NP', 'TP', 'RP', 'NYP', 'ITE'];

export default function Upload() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    module_code: '',
    school: '',
    note_type: 'main',
    description: '',
    file_url: '',
    file_name: '',
  });

  const createNote = useMutation({
    mutationFn: (data) => noteshareApi.notes.create(data),
    onSuccess: () => navigate('/'),
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error?.message || 'Could not create the note. Please try again.',
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createNote.mutate({
      title: form.title,
      module_code: form.module_code.toUpperCase(),
      school: form.school,
      note_type: form.note_type,
      description: form.description,
      file_url: form.file_url,
      file_name: form.file_name,
      views: 0,
      saves: 0,
    });
  };

  const isValid = form.title && form.module_code && form.school && form.file_url;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to notes
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-bold tracking-tight mb-2">Upload Notes</h1>
        <p className="text-muted-foreground mb-8">Share your study notes with fellow students.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <UploadZone
            onFileUploaded={(url, name) => setForm({ ...form, file_url: url, file_name: name })}
          />

          <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Module Code *</Label>
                <Input
                  value={form.module_code}
                  onChange={(e) => setForm({ ...form, module_code: e.target.value })}
                  placeholder="e.g. IT1234"
                  className="font-mono uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label>School *</Label>
                <Select value={form.school} onValueChange={(v) => setForm({ ...form, school: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select school" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHOOLS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Chapter 3 Summary - Data Structures"
              />
            </div>

            <div className="space-y-2">
              <Label>Note Type</Label>
              <Select value={form.note_type} onValueChange={(v) => setForm({ ...form, note_type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main Notes</SelectItem>
                  <SelectItem value="personal">Personal Notes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of what's covered..."
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full gap-2 shadow-lg shadow-primary/20"
            disabled={!isValid || createNote.isPending}
          >
            {createNote.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Uploading...</>
            ) : (
              <><Send className="w-4 h-4" />Upload Note</>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
