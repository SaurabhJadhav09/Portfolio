import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';

export default function ThemeToggle() {
  // Comment out the dark mode state and useEffect:
  
  // const [dark, setDark] = useState(false);

  // useEffect(() => {
  //   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  //   const stored = localStorage.getItem('theme') === 'dark';
  //   const isDark = stored || (!('theme' in localStorage) && prefersDark);
  //   setDark(isDark);
  //   document.documentElement.classList.toggle('dark', isDark);
  // }, []);
  
  // Disable toggle function (or empty it)
  const toggle = () => {
    // Do nothing for now
    // Or optionally alert something like console.log('Dark mode disabled')
  };

  // Optionally, don't show the button or keep it but styled for light mode only
  // return (
    // <button
    //   onClick={toggle}
    //   aria-label="Toggle theme"
    //   title="Toggle theme"
    //   className="theme-toggle w-10 h-10 flex items-center justify-center cursor-not-allowed opacity-50"
    //   disabled
    // >
    //   {/* Show moon icon always with light mode colors */}
    //   <FontAwesomeIcon icon={faMoon} className="text-gray-950" />
    // </button>
  // );
}
