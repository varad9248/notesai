'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useNotesStore } from '@/store/useNotesStore';
import { Loader2, StickyNote } from 'lucide-react';
import { toast } from 'sonner';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp } = useNotesStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success('Welcome back!');
      } else {
        await signUp(email, password);
        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-zinc-900 dark:to-zinc-800 px-4 py-8">
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left branding / illustration */}
        <div className="hidden md:flex flex-col items-center justify-center p-10 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <StickyNote className="h-12 w-12 mb-4" />
          <h2 className="text-3xl font-bold">Welcome to NotesAI</h2>
          <p className="text-sm mt-2 text-white/80 text-center px-4">
            The smart way to write, organize, and enhance your notes using AI.
          </p>
        </div>

        {/* Right form */}
        <form onSubmit={handleSubmit} className="p-8 md:p-10">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="text-center md:text-left">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLogin ? 'Sign in to NotesAI' : 'Create your NotesAI account'}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {isLogin
                  ? 'Enter your email and password to continue'
                  : 'Sign up to start organizing notes with AI'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 mt-3">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-10"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 mt-4">
              <Button
                type="submit"
                className="w-full h-10 font-semibold"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLogin ? 'Sign in' : 'Sign up'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-sm text-blue-600 dark:text-blue-400"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
