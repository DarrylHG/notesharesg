import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function TrendingModules({ notes }) {
  const moduleCounts = {};
  notes.forEach((note) => {
    const key = `${note.module_code}|${note.school}`;
    moduleCounts[key] = (moduleCounts[key] || 0) + 1;
  });

  const trending = Object.entries(moduleCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([key, count]) => {
      const [code, school] = key.split('|');
      return { code, school, count };
    });

  if (trending.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <h3 className="font-heading font-semibold text-sm flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-primary" />
        Trending Modules
      </h3>
      <div className="space-y-3">
        {trending.map(({ code, school, count }, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground w-5">
                #{i + 1}
              </span>
              <span className="text-sm font-mono font-semibold">{code}</span>
              <span className="text-xs text-muted-foreground">{school}</span>
            </div>
            <span className="text-xs text-muted-foreground">{count} notes</span>
          </div>
        ))}
      </div>
    </div>
  );
}
