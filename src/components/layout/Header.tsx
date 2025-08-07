'use client';

import ThemeToggle from '@/components/ui/ThemeToggle';

const navItems = ['home', 'about', 'skills', 'experience', 'projects', 'contact'];

export default function Header() {
  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center pointer-events-none">
      <nav className="glass-card max-w-6xl w-[95%] py-3 px-6 flex items-center justify-between rounded-2xl shadow-lg pointer-events-auto">
        <div className="nav-logo flex items-center gap-2">
          <h3 className="text-2xl font-extrabold text-accent tracking-tight">SJ</h3>
          <span className="sr-only">Saurabh Jadhav</span>
        </div>
        <ul className="hidden sm:flex gap-6 font-medium nav-menu" id="nav-menu" role="menubar">
          {navItems.map((id) => (
            <li key={id} role="none">
              <a
                href={`#${id}`}
                className="nav-link text-gray-800 dark:text-gray-200 hover:text-accent transition"
                role="menuitem"
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4 nav-actions">
          <ThemeToggle />
          <button
            className="hamburger flex sm:hidden flex-col gap-1"
            id="hamburger"
            type="button"
            aria-label="Toggle mobile menu"
            aria-expanded="false"
          >
            <span className="block w-6 h-0.5 bg-current"></span>
            <span className="block w-6 h-0.5 bg-current"></span>
            <span className="block w-6 h-0.5 bg-current"></span>
          </button>
        </div>
      </nav>
    </header>
  );
}
