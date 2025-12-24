
import React, { useEffect, useState, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    window.addEventListener('mousemove', moveCursor);
    
    const hoverables = document.querySelectorAll('button, a, .hoverable');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      hoverables.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 w-6 h-6 border-2 border-kakao-brown dark:border-kakao-yellow rounded-full pointer-events-none z-[9999] -ml-3 -mt-3 transition-all duration-300 ease-out mix-blend-difference flex items-center justify-center ${
        isHovered ? 'w-16 h-16 bg-kakao-yellow/20 border-kakao-yellow' : 'bg-transparent'
      }`}
    />
  );
};

export default CustomCursor;
