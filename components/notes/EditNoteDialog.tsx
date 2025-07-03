"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useNotesStore } from "@/store/useNotesStore";
import { Note } from "@/lib/supabase";

interface EditNoteDialogProps {
  note: Note;
}

export function EditNoteDialog({ note }: EditNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [color, setColor] = useState(note.color || "default");
  const [isEnhancing, setIsEnhancing] = useState(false);

  const { updateNote } = useNotesStore();

  const handleEnhance = async () => {
    if (!content.trim()) {
      toast.error("No content to enhance");
      return;
    }

    setIsEnhancing(true);
    try {
      const res = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();
      console.log("Enhance response:", data);

      if (!res.ok || !data.content) {
        throw new Error(data.error || "No result from AI");
      }

      setContent(data.content);
      toast.success("Note enhanced");
    } catch (error) {
      console.error("Enhance error:", error);
      toast.error("Enhancement failed");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      toast.error("Please add some content");
      return;
    }

    await updateNote(note.id, {
      title: title.trim() || "Untitled",
      content: content.trim(),
      color,
    });

    toast.success("Note updated");
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle(note.title);
    setContent(note.content);
    setColor(note.color || "default");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Pencil className="h-4 w-4 text-gray-500" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Enhance with AI */}
          <div className="border border-purple-200 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50">
            <Label className="flex items-center space-x-2 text-purple-700 font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Enhance Note with AI</span>
            </Label>
            <div className="flex space-x-2 mt-2">
              <Button
                onClick={handleEnhance}
                disabled={isEnhancing}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isEnhancing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </Button>
              <span className="text-sm text-gray-600">
                Improve clarity or structure of your note
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Edit title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content (Markdown supported)</Label>
            <Textarea
              id="content"
              placeholder="Edit your note content..."
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
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
