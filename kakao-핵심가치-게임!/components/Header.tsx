
import React, { useState } from 'react';
import { UnlockState } from '../App';

interface HeaderProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  totalPoints: number;
  unlocked: UnlockState;
}

const Header: React.FC<HeaderProps> = ({ toggleDarkMode, isDarkMode, totalPoints, unlocked }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: '회사소개', href: '#intro', isLocked: false },
    { label: '역사', href: '#history', isLocked: !unlocked.history },
    { label: '미션 & 비전', href: '#mission', isLocked: !unlocked.mission },
    { label: '핵심가치', href: '#values', isLocked: !unlocked.values },
    { label: 'Work Way', href: '#workWay', isLocked: !unlocked.workWay },
    { label: '인재상', href: '#talent-section', isLocked: !unlocked.workWay },
  ];

  return (
    <header className="fixed w-full top-0 z-50">
      <div className="bg-white/80 dark:bg-kakao-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div 
              className="flex-shrink-0 cursor-pointer font-black text-2xl tracking-tighter text-kakao-brown dark:text-kakao-yellow hoverable"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              KAKAO
            </div>

            <nav className="hidden md:flex space-x-6 items-center">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.isLocked ? '#' : item.href}
                  onClick={(e) => item.isLocked && e.preventDefault()}
                  className={`px-2 py-2 rounded-md text-sm font-bold transition-all hoverable ${
                    item.isLocked 
                    ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed grayscale' 
                    : 'text-kakao-brown dark:text-gray-200 hover:text-kakao-yellow dark:hover:text-kakao-yellow'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {item.label}
                    {item.isLocked && <i className="fas fa-lock text-[10px] opacity-50"></i>}
                  </span>
                </a>
              ))}
              
              <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2"></div>
              
              <div className="flex items-center gap-2 bg-kakao-yellow/10 dark:bg-kakao-yellow/5 px-4 py-2 rounded-full border border-kakao-yellow/20">
                <span className="text-[10px] font-black text-kakao-brown/40 dark:text-gray-500 uppercase">Points</span>
                <span className="font-black text-kakao-brown dark:text-kakao-yellow animate-pulse">{totalPoints.toLocaleString()}</span>
              </div>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hoverable text-xl"
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
            </nav>

            <div className="md:hidden flex items-center space-x-4">
              <div className="bg-kakao-yellow px-3 py-1 rounded-full text-xs font-black text-kakao-brown">
                {totalPoints.toLocaleString()} P
              </div>
              <button onClick={toggleDarkMode} className="text-xl">{isDarkMode ? '🌞' : '🌙'}</button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-kakao-brown dark:text-white"
              >
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-kakao-black border-t dark:border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.isLocked ? '#' : item.href}
                  onClick={(e) => {
                    if (item.isLocked) {
                      e.preventDefault();
                    } else {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    item.isLocked 
                    ? 'text-gray-300 dark:text-gray-700' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.label} {item.isLocked && '🔒'}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
