import React, { useState } from 'react';
import { noteshareApi } from '@/api/noteshareApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

export default function CommentSection({ noteId, comments }) {
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const createComment = useMutation({
    mutationFn: (data) => noteshareApi.comments.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', noteId] });
      setContent('');
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Comment failed',
        description: error?.message || 'Could not post your comment. Please try again.',
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    createComment.mutate({ note_id: noteId, content: content.trim() });
  };

  return (
    <div className="space-y-6">
      <h3 className="font-heading font-semibold flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        Comments ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts on this note..."
          className="min-h-[80px] rounded-xl resize-none"
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={!content.trim() || createComment.isPending} className="gap-2">
            <Send className="w-3.5 h-3.5" />
            {createComment.isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-muted/50 rounded-xl p-4"
            >
              <p className="text-sm leading-relaxed">{comment.content}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>{comment.author_name || 'Anonymous'}</span>
                <span>·</span>
                <span>{comment.created_date ? format(new Date(comment.created_date), 'dd MMM yyyy, HH:mm') : ''}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
