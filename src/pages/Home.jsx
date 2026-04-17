import React, { useState, useMemo } from 'react';
import { noteshareApi } from '@/api/noteshareApi';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import SearchBar from '../components/feed/SearchBar';
import SchoolFilterChips from '../components/feed/SchoolFilterChips';
import NoteCard from '../components/feed/NoteCard';
import NoteTypeFilter from '../components/feed/NoteTypeFilter';
import TrendingModules from '../components/feed/TrendingModules';
import RecentActivity from '../components/feed/RecentActivity';
import { Loader2, BookOpen, Sparkles } from 'lucide-react';

export default function Home() {
  const [search, setSearch] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: () => noteshareApi.notes.list({ sort: '-created_date', limit: 100 }),
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['all-comments'],
    queryFn: () => noteshareApi.comments.list({ sort: '-created_date', limit: 20 }),
  });

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch = !search ||
        note.module_code?.toLowerCase().includes(search.toLowerCase()) ||
        note.title?.toLowerCase().includes(search.toLowerCase());
      const matchesSchool = schoolFilter === 'all' || note.school === schoolFilter;
      const matchesType = typeFilter === 'all' || note.note_type === typeFilter;
      return matchesSearch && matchesSchool && matchesType;
    });
  }, [notes, search, schoolFilter, typeFilter]);

  const commentCounts = useMemo(() => {
    const counts = {};
    comments.forEach((c) => {
      counts[c.note_id] = (counts[c.note_id] || 0) + 1;
    });
    return counts;
  }, [comments]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          For Singapore Poly & ITE Students
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          Find & Share Notes
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Access study notes from fellow students across SP, NP, TP, RP, NYP & ITE.
        </p>
      </motion.div>

      <div className="space-y-4 mb-8">
        <SearchBar value={search} onChange={setSearch} />
        <SchoolFilterChips selected={schoolFilter} onSelect={setSchoolFilter} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-2 hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Note Type
              </h4>
              <NoteTypeFilter selected={typeFilter} onSelect={setTypeFilter} />
            </div>
          </div>
        </aside>

        <div className="lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'main', 'personal'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  typeFilter === t
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {t === 'all' ? 'All' : t === 'main' ? 'Main Notes' : 'Personal Notes'}
              </button>
            ))}
          </div>
        </div>

        <main className="lg:col-span-7">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-1">No notes found</h3>
              <p className="text-sm text-muted-foreground">
                {search ? 'Try a different search term' : 'Be the first to upload notes!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  commentCount={commentCounts[note.id] || 0}
                />
              ))}
            </div>
          )}
        </main>

        <aside className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <TrendingModules notes={notes} />
            <RecentActivity comments={comments} />
          </div>
        </aside>
      </div>
    </div>
  );
}
