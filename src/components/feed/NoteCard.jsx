import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Bookmark, MessageCircle, FileText, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const schoolColors = {
  SP: 'bg-blue-100 text-blue-700',
  NP: 'bg-emerald-100 text-emerald-700',
  TP: 'bg-orange-100 text-orange-700',
  RP: 'bg-purple-100 text-purple-700',
  NYP: 'bg-rose-100 text-rose-700',
  ITE: 'bg-cyan-100 text-cyan-700',
};

export default function NoteCard({ note, commentCount = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Link to={`/note/${note.id}`}>
        <div className="group bg-card rounded-2xl border border-border p-5 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge className={`${schoolColors[note.school] || 'bg-muted text-muted-foreground'} border-0 font-semibold`}>
                {note.school}
              </Badge>
              <span className="text-sm font-mono font-semibold text-primary">
                {note.module_code}
              </span>
            </div>
            <Badge variant={note.note_type === 'main' ? 'default' : 'outline'} className="text-xs">
              {note.note_type === 'main' ? (
                <><FileText className="w-3 h-3 mr-1" />Main</>
              ) : (
                <><User className="w-3 h-3 mr-1" />Personal</>
              )}
            </Badge>
          </div>

          <h3 className="font-heading font-semibold text-lg mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
            {note.title}
          </h3>
          {note.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {note.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-border/60">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {note.views || 0}
              </span>
              <span className="flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5" />
                {note.saves || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                {commentCount}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {note.created_date ? format(new Date(note.created_date), 'dd MMM yyyy') : ''}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
