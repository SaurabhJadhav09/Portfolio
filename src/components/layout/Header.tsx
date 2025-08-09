'use client';
import { useState } from 'react';
import ThemeToggle from '@/components/ui/ThemeToggle';

const navItems = ['home', 'about', 'skills', 'experience', 'projects', 'contact'];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
     <>
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center pointer-events-none">
        <nav className="glass-card max-w-6xl w-[95%] py-3 px-6 flex items-center justify-between rounded-2xl shadow-lg pointer-events-auto">
          <div className="nav-logo flex items-center gap-2">
            <h3 className="text-2xl font-extrabold text-accent tracking-tight">SJ</h3>
            <span className="sr-only">Saurabh Jadhav</span>
          </div>
          
          {/* Desktop Navigation */}
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
            {/* <ThemeToggle /> */}
            <button
              className={`hamburger flex sm:hidden flex-col gap-1 ${isMenuOpen ? 'active' : ''}`}
              id="hamburger"
              type="button"
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <span className="block w-6 h-0.5 bg-current transition-transform duration-300"></span>
              <span className="block w-6 h-0.5 bg-current transition-opacity duration-300"></span>
              <span className="block w-6 h-0.5 bg-current transition-transform duration-300"></span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay fixed inset-0 z-40 transition-opacity duration-300 ${
        isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeMenu}
        />
        <nav className={`mobile-menu fixed top-0 right-0 h-full w-80 max-w-[80%] glass-card transform transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full pt-20 px-6">
            <ul className="flex flex-col gap-4" role="menubar">
              {navItems.map((id) => (
                <li key={id} role="none">
                  <a
                    href={`#${id}`}
                    className="block text-xl font-medium text-gray-800 dark:text-gray-200 hover:text-accent transition py-3 border-b border-gray-200/20"
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}