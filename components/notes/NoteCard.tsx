'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotesStore } from '@/store/useNotesStore';
import { Note } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Pin, Trash2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { EditNoteDialog } from './EditNoteDialog';
import { DeleteNoteDialog } from './DeleteNoteDialog';

interface NoteCardProps {
  note: Note;
}

const colorClasses = {
  default: 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600',
  yellow: 'bg-yellow-50 dark:bg-yellow-100/10 border-yellow-200 dark:border-yellow-400 hover:border-yellow-300',
  blue: 'bg-blue-50 dark:bg-blue-100/10 border-blue-200 dark:border-blue-400 hover:border-blue-300',
  green: 'bg-green-50 dark:bg-green-100/10 border-green-200 dark:border-green-400 hover:border-green-300',
  pink: 'bg-pink-50 dark:bg-pink-100/10 border-pink-200 dark:border-pink-400 hover:border-pink-300',
  purple: 'bg-purple-50 dark:bg-purple-100/10 border-purple-200 dark:border-purple-400 hover:border-purple-300',
  orange: 'bg-orange-50 dark:bg-orange-100/10 border-orange-200 dark:border-orange-400 hover:border-orange-300',
};

export function NoteCard({ note }: NoteCardProps) {
  const { updateNote, deleteNote } = useNotesStore();

  const handlePin = async () => {
    await updateNote(note.id, { is_pinned: !note.is_pinned });
    toast.success(note.is_pinned ? 'Note unpinned' : 'Note pinned');
  };


  const colorClass =
    colorClasses[note.color as keyof typeof colorClasses] ||
    colorClasses.default;

  return (
    <Card className={`${colorClass} border-2 transition-all duration-200 hover:shadow-lg group relative`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {note.title || 'Untitled'}
            </h3>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="ghost" onClick={handlePin} className="h-8 w-8 p-0">
              <Pin className={`h-4 w-4 ${note.is_pinned ? 'text-amber-500 fill-current' : 'text-gray-500 dark:text-gray-400'}`} />
            </Button>

            <EditNoteDialog note={note} />
            <DeleteNoteDialog noteId={note.id} />

          </div>
        </div>

        {/* Content */}
        <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none text-gray-800 dark:prose-invert">
          {note.content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: (props) => <a {...props} className="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer" />,
                code: ({node, ...props}) =>
                  node && node.type === 'inlineCode' ? (
                    <code className="bg-gray-100 dark:bg-zinc-800 text-red-600 dark:text-red-400 px-1 py-0.5 rounded">
                      {props.children}
                    </code>
                  ) : (
                    <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{props.children}</code>
                    </pre>
                  ),
              }}
            >
              {note.content}
            </ReactMarkdown>
          ) : (
            <p className="text-gray-400 italic">Empty note</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-4">
          <Badge variant="secondary" className="text-xs capitalize">
            {note.color === 'default' ? 'No color' : note.color}
          </Badge>
          <span>
            {formatDistanceToNow(new Date(note.updated_at), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </Card>
  );
}
