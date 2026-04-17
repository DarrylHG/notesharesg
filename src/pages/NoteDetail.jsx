import React, { useEffect } from 'react';
import { noteshareApi } from '@/api/noteshareApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CommentSection from '../components/note/CommentSection';
import { ArrowLeft, Download, Eye, Bookmark, FileText, User, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const schoolColors = {
  SP: 'bg-blue-100 text-blue-700',
  NP: 'bg-emerald-100 text-emerald-700',
  TP: 'bg-orange-100 text-orange-700',
  RP: 'bg-purple-100 text-purple-700',
  NYP: 'bg-rose-100 text-rose-700',
  ITE: 'bg-cyan-100 text-cyan-700',
};

export default function NoteDetail() {
  const noteId = window.location.pathname.split('/note/')[1];
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading: notesLoading } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => noteshareApi.notes.getById(noteId),
    enabled: !!noteId,
  });

  const note = notes;

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', noteId],
    queryFn: () => noteshareApi.comments.list({ noteId, sort: '-created_date', limit: 200 }),
    enabled: !!noteId,
  });

  const incrementViews = useMutation({
    mutationFn: ({ id, views }) => noteshareApi.notes.update(id, { views: (views || 0) + 1 }),
  });

  useEffect(() => {
    if (note && !incrementViews.isSuccess) {
      incrementViews.mutate({ id: note.id, views: note.views });
    }
  }, [note?.id]);

  const saveNote = useMutation({
    mutationFn: ({ id, saves }) => noteshareApi.notes.update(id, { saves: (saves || 0) + 1 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['note', noteId] }),
  });

  if (notesLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="font-heading text-2xl font-bold mb-2">Note not found</h2>
        <Link to="/" className="text-primary hover:underline text-sm">Back to notes</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to notes
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className={`${schoolColors[note.school] || ''} border-0 font-semibold`}>
              {note.school}
            </Badge>
            <span className="font-mono font-semibold text-primary text-sm">
              {note.module_code}
            </span>
            <Badge variant={note.note_type === 'main' ? 'default' : 'outline'} className="text-xs">
              {note.note_type === 'main' ? (
                <><FileText className="w-3 h-3 mr-1" />Main Notes</>
              ) : (
                <><User className="w-3 h-3 mr-1" />Personal Notes</>
              )}
            </Badge>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            {note.title}
          </h1>

          {note.description && (
            <p className="text-muted-foreground leading-relaxed mb-6">
              {note.description}
            </p>
          )}

          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {(note.views || 0) + 1} views
            </span>
            <span className="flex items-center gap-1.5">
              <Bookmark className="w-4 h-4" />
              {note.saves || 0} saves
            </span>
            {note.created_date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {format(new Date(note.created_date), 'dd MMM yyyy')}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {note.file_url && (
              <a href={note.file_url} target="_blank" rel="noopener noreferrer">
                <Button className="gap-2 shadow-lg shadow-primary/20">
                  <Download className="w-4 h-4" />
                  Download {note.file_name || 'File'}
                </Button>
              </a>
            )}
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => saveNote.mutate({ id: note.id, saves: note.saves })}
              disabled={saveNote.isPending}
            >
              <Bookmark className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>

        {note.file_url && note.file_url.endsWith('.pdf') && (
          <div className="bg-card rounded-2xl border border-border p-2 mb-6 overflow-hidden">
            <iframe
              src={note.file_url}
              className="w-full h-[600px] rounded-xl"
              title="Note preview"
            />
          </div>
        )}

        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
          <CommentSection noteId={noteId} comments={comments} />
        </div>
      </motion.div>
    </div>
  );
}
