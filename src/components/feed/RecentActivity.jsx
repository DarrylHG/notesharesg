import React from 'react';
import { MessageCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function RecentActivity({ comments }) {
  const recent = comments.slice(0, 5);

  if (recent.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <h3 className="font-heading font-semibold text-sm flex items-center gap-2 mb-4">
        <MessageCircle className="w-4 h-4 text-accent" />
        Recent Comments
      </h3>
      <div className="space-y-3">
        {recent.map((comment) => (
          <div key={comment.id} className="text-sm">
            <p className="text-muted-foreground line-clamp-2">{comment.content}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground/60">
              <Clock className="w-3 h-3" />
              {comment.created_date ? format(new Date(comment.created_date), 'dd MMM, HH:mm') : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
