import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Upload, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/noteshare-logo.svg"
              alt="NoteShareSG logo"
              className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-primary/20 group-hover:shadow-primary/35 transition-shadow"
            />
            <span className="font-heading text-xl font-bold tracking-tight">
              NoteShare<span className="text-red-500">SG</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Browse
              </Button>
            </Link>
            <Link to="/upload">
              <Button size="sm" className="gap-2 shadow-lg shadow-primary/20">
                <Upload className="w-4 h-4" />
                Upload Notes
              </Button>
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Browse</Button>
            </Link>
            <Link to="/upload" onClick={() => setMobileOpen(false)}>
              <Button className="w-full gap-2">
                <Upload className="w-4 h-4" />
                Upload Notes
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
