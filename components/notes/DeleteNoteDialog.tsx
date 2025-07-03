'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { useNotesStore } from '@/store/useNotesStore';

interface DeleteNoteDialogProps {
  noteId: string;
}

export function DeleteNoteDialog({ noteId }: DeleteNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { deleteNote } = useNotesStore();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteNote(noteId);
      toast.success('Note deleted');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to delete note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete this note?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to permanently delete this note?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
