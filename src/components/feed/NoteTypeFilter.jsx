import React from 'react';
import { FileText, User, Layers } from 'lucide-react';

const TYPES = [
  { id: 'all', label: 'All Notes', icon: Layers },
  { id: 'main', label: 'Main Notes', icon: FileText },
  { id: 'personal', label: 'Personal Notes', icon: User },
];

export default function NoteTypeFilter({ selected, onSelect }) {
  return (
    <div className="space-y-1">
      {TYPES.map(({ id, label, icon: Icon }) => {
        const isActive = selected === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
