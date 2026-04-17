import React from 'react';
import { motion } from 'framer-motion';

const SCHOOLS = [
  { id: 'all', label: 'All Schools', color: 'bg-foreground/10 text-foreground' },
  { id: 'SP', label: 'SP', color: 'bg-blue-100 text-blue-700' },
  { id: 'NP', label: 'NP', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'TP', label: 'TP', color: 'bg-orange-100 text-orange-700' },
  { id: 'RP', label: 'RP', color: 'bg-purple-100 text-purple-700' },
  { id: 'NYP', label: 'NYP', color: 'bg-rose-100 text-rose-700' },
  { id: 'ITE', label: 'ITE', color: 'bg-cyan-100 text-cyan-700' },
];

export default function SchoolFilterChips({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {SCHOOLS.map((school) => {
        const isActive = selected === school.id;
        return (
          <motion.button
            key={school.id}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(school.id)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                : `${school.color} hover:opacity-80`
              }
            `}
          >
            {school.label}
          </motion.button>
        );
      })}
    </div>
  );
}
