'use client';

import { useEffect } from 'react';
import { useNotesStore } from '@/store/useNotesStore';
import { AuthForm } from '@/components/auth/AuthForm';
import { Header } from '@/components/layout/Header';
import { SearchAndFilters } from '@/components/notes/SearchAndFilters';
import { NotesGrid } from '@/components/notes/NotesGrid';
import { Loader2 } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { motion } from 'framer-motion';

export default function Home() {
  const { user, isAuthLoading, initialize } = useNotesStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-300" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <AuthForm />
        </motion.div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <Header />
      </motion.div>
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <SearchAndFilters />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <NotesGrid />
        </motion.div>
      </main>
      <Toaster />
    </div>
  );
}
