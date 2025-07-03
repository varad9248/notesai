'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useNotesStore } from '@/store/useNotesStore';
import { CreateNoteDialog } from '@/components/notes/CreateNoteDialog';
import { ChatDialog } from '@/components/chat/ChatDialog';
import {
  StickyNote,
  Plus,
  MessageCircle,
  LogOut,
  User,
  Menu
} from 'lucide-react';
import { toast } from 'sonner';

export function Header() {
  const { user, signOut } = useNotesStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-white/20 dark:border-gray-700/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#4338CA] to-[#7C3AED] rounded-lg flex items-center justify-center">
              <StickyNote className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#4338CA] to-[#7C3AED] bg-clip-text text-transparent">
              NotesAI
            </span>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button size="icon" variant="ghost" onClick={() => setMenuOpen(!menuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <CreateNoteDialog>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </CreateNoteDialog>

            <ChatDialog>
              <Button size="sm" variant="outline">
                <MessageCircle className="h-4 w-4 mr-1" />
                Chat
              </Button>
            </ChatDialog>

            {/* Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-sm w-48">
                <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 text-left">
                  <p className="font-medium truncate">{user?.email}</p>
                </div>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="mt-4 flex flex-col space-y-2 lg:hidden">
            <CreateNoteDialog>
              <Button size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </CreateNoteDialog>

            <ChatDialog>
              <Button size="sm" variant="outline" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </ChatDialog>

            <div className="text-xs text-left text-gray-500 dark:text-gray-400 px-2 truncate">
              {user?.email}
            </div>

            <Button
              size="sm"
              variant="destructive"
              onClick={handleSignOut}
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
