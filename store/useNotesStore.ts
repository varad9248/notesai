import { create } from 'zustand';
import { supabase, Note } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface NotesState {
  notes: Note[];
  user: User | null;
  isLoading: boolean;
  isAuthLoading: boolean;
  searchQuery: string;
  selectedColor: string;
  setUser: (user: User | null) => void;
  setNotes: (notes: Note[]) => void;
  addNote: (note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => Promise<Note | null>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  fetchNotes: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedColor: (color: string) => void;
  getFilteredNotes: () => Note[];
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  user: null,
  isLoading: false,
  isAuthLoading: true,
  searchQuery: '',
  selectedColor: 'all',

  setUser: (user) => set({ user }),
  
  setNotes: (notes) => set({ notes }),

  addNote: async (noteData) => {
    const { user } = get();
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          ...noteData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        notes: [data, ...state.notes]
      }));

      return data;
    } catch (error) {
      console.error('Error adding note:', error);
      return null;
    }
  },

  updateNote: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? { ...note, ...updates } : note
        )
      }));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  },

  deleteNote: async (id) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  },

  fetchNotes: async () => {
    const { user } = get();
    if (!user) return;

    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ notes: data });
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  
  setSelectedColor: (selectedColor) => set({ selectedColor }),

  getFilteredNotes: () => {
    const { notes, searchQuery, selectedColor } = get();
    
    return notes.filter((note) => {
      const matchesSearch = searchQuery === '' || 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesColor = selectedColor === 'all' || note.color === selectedColor;
      
      return matchesSearch && matchesColor;
    });
  },

  signIn: async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  signUp: async (email, password) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, notes: [] });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user || null, isAuthLoading: false });

      if (session?.user) {
        get().fetchNotes();
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        set({ user: session?.user || null });
        
        if (session?.user) {
          get().fetchNotes();
        } else {
          set({ notes: [] });
        }
      });

    } catch (error) {
      console.error('Error initializing:', error);
      set({ isAuthLoading: false });
    }
  },
}));