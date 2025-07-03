'use client';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 dark:border-gray-700/20 py-6 mt-10 relative z-10">
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} NotesAI. Made with ❤️ to boost your productivity.
      </div>
    </footer>
  );
}
