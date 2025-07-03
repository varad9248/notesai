'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNotesStore } from '@/store/useNotesStore';
import { generateNoteFromPrompt } from '@/lib/openai';
import { Plus, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreateNoteDialogProps {
  children: React.ReactNode;
}

export function CreateNoteDialog({ children }: CreateNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('default');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { addNote } = useNotesStore();

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      toast.error('Please add some content to your note');
      return;
    }

    const note = await addNote({
      title: title.trim() || 'Untitled',
      content: content.trim(),
      color,
      is_pinned: false,
      user_id: '',
    });

    if (note) {
      toast.success('Note created successfully');
      handleClose();
    } else {
      toast.error('Failed to create note');
    }
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setColor('default');
    setAiPrompt('');
    setOpen(false);
  };

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a prompt for AI generation');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedContent = await generateNoteFromPrompt(aiPrompt);
      setContent(generatedContent);
      setTitle(aiPrompt.slice(0, 50) + (aiPrompt.length > 50 ? '...' : ''));
      toast.success('Note generated with AI');
    } catch (error) {
      toast.error('Failed to generate note with AI');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* AI Generation Section */}
          <div className="border border-purple-200 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50">
            <Label htmlFor="ai-prompt" className="flex items-center space-x-2 text-purple-700 font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Generate with AI</span>
            </Label>
            <div className="flex space-x-2 mt-2">
              <Input
                id="ai-prompt"
                placeholder="Enter a topic or prompt for AI to create your note..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleGenerateWithAI} disabled={isGenerating} size="sm" className="bg-purple-600 hover:bg-purple-700">
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content (Markdown supported)</Label>
            <Textarea
              id="content"
              placeholder="Write your note content... You can use markdown formatting!"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-48 resize-y"
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label>Color</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="pink">Pink</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Note
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}