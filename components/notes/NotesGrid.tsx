'use client';

import { useNotesStore } from '@/store/useNotesStore';
import { NoteCard } from './NoteCard';
import { Loader2, StickyNote } from 'lucide-react';

export function NotesGrid() {
  const { getFilteredNotes, isLoading } = useNotesStore();
  const notes = getFilteredNotes();

  const pinnedNotes = notes.filter((note) => note.is_pinned);
  const unpinnedNotes = notes.filter((note) => !note.is_pinned);

  const MasonrySection = ({ title, notes }: { title: string; notes: typeof pinnedNotes }) => (
    <div>
      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
        {title}
      </h2>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="break-inside-avoid">
            <NoteCard note={note} />
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-300" />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center text-gray-500 dark:text-gray-400 animate-in fade-in slide-in-from-bottom-6 duration-500">
        <StickyNote className="h-16 w-16 mb-4 text-gray-300 dark:text-zinc-600" />
        <h3 className="text-lg font-semibold mb-2">No notes found</h3>
        <p className="text-sm max-w-xs">
          Looks like you haven’t added any notes yet. Click the “+” button or remove filters to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {pinnedNotes.length > 0 && <MasonrySection title="Pinned" notes={pinnedNotes} />}
      {unpinnedNotes.length > 0 && <MasonrySection title="Others" notes={unpinnedNotes} />}
    </div>
  );
}
