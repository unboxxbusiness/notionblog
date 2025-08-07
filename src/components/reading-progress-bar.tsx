'use client';

import { useState, useEffect } from 'react';

export function ReadingProgressBar() {
  const [width, setWidth] = useState(0);

  const handleScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPosition = window.scrollY;
    // Prevent division by zero
    if (totalHeight > 0) {
      const scrollPercentage = (scrollPosition / totalHeight) * 100;
      setWidth(scrollPercentage);
    } else {
      setWidth(0);
    }
  };

  useEffect(() => {
    // Call handler once to set initial state
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Recalculate on resize
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-50 h-1 bg-primary transition-all duration-75 ease-out"
      style={{ width: `${width}%` }}
      aria-hidden="true"
    />
  );
}
