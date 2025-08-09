'use client';

import { useState, useEffect } from 'react';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scroll when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isMenuOpen) {
        const target = event.target as Element;
        if (!target.closest('.glass-card') && !target.closest('.mobile-menu-overlay')) {
          closeMenu();
        }
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center pointer-events-none">
        <nav className="glass-card max-w-6xl w-[95%] py-3 px-6 flex items-center justify-between rounded-2xl shadow-lg pointer-events-auto">
          <div className="nav-logo flex items-center gap-2">
            <h3 className="text-2xl font-extrabold text-accent tracking-tight">SJ</h3>
            <span className="sr-only">Saurabh Jadhav</span>
          </div>
          
          {/* Desktop Navigation */}
          <ul className="desktop-nav hidden sm:flex gap-6 font-medium" role="menubar">
            {navItems.map((item) => (
              <li key={item.id} role="none">
                <a
                  href={`#${item.id}`}
                  className="nav-link text-gray-800 dark:text-gray-200 hover:text-accent transition-colors duration-200"
                  role="menuitem"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-4 nav-actions">
            {/* Hamburger Button - Only visible on mobile */}
            <button
              className={`hamburger flex sm:hidden flex-col gap-1 relative z-[60] ${isMenuOpen ? 'active' : ''}`}
              type="button"
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <span className="block w-6 h-0.5 bg-current transition-all duration-300"></span>
              <span className="block w-6 h-0.5 bg-current transition-all duration-300"></span>
              <span className="block w-6 h-0.5 bg-current transition-all duration-300"></span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay fixed inset-0 z-40 sm:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMenu}
          />
          <nav className="mobile-nav fixed top-0 right-0 h-full w-80 max-w-[85%] glass-card transform transition-transform duration-300 translate-x-0">
            <div className="flex flex-col h-full pt-20 px-6">
              <ul className="flex flex-col gap-4" role="menubar">
                {navItems.map((item) => (
                  <li key={item.id} role="none">
                    <a
                      href={`#${item.id}`}
                      className="block text-xl font-medium text-gray-800 dark:text-gray-200 hover:text-accent transition-colors duration-200 py-3 border-b border-gray-200/20"
                      role="menuitem"
                      onClick={closeMenu}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
