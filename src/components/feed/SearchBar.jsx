import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by module code (e.g. IT1234, BUS205)..."
        className="pl-12 h-12 text-base rounded-xl bg-card border-border shadow-sm focus:shadow-md transition-shadow"
      />
    </div>
  );
}
