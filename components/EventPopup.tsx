import React, { useState, useEffect } from 'react';

const EventPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if "don't show today" was set
    const hideUntil = localStorage.getItem('eventPopupHideUntil');
    if (hideUntil) {
      const hideDate = new Date(hideUntil);
      if (new Date() < hideDate) {
        return; // Don't show popup
      }
    }
    // Show popup after a short delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleDontShowToday = () => {
    // Set hide until end of today
    const tomorrow = new Date();
    tomorrow.setHours(23, 59, 59, 999);
    localStorage.setItem('eventPopupHideUntil', tomorrow.toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative max-w-[500px] w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
        {/* Close Button - positioned inside on mobile for visibility */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 sm:-top-3 sm:-right-3 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white border-2 sm:border-3 border-black rounded-full shadow-[2px_2px_0px_black] sm:shadow-[3px_3px_0px_black] flex items-center justify-center font-black text-lg sm:text-xl hover:bg-red-500 hover:text-white transition-colors"
          aria-label="닫기"
        >
          ✕
        </button>

        {/* Poster Container */}
        <div className="bg-white border-3 sm:border-4 border-black shadow-[4px_4px_0px_black] sm:shadow-[8px_8px_0px_black] overflow-hidden flex flex-col max-h-[calc(90vh-60px)]">
          {/* Header */}
          <div className="bg-black text-white p-2 sm:p-3 text-center flex-shrink-0">
            <h2 className="text-[10px] sm:text-xs font-mono tracking-widest text-yellow-400">2026 HR/OD INNOVATION</h2>
          </div>

          {/* Main Content - Scrollable */}
          <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-5 overflow-y-auto flex-1">
            {/* Catchphrase */}
            <div className="text-center">
              <p className="text-xs sm:text-sm font-bold text-gray-500 mb-1">"언제까지 수첩만 나눠주시겠습니까?"</p>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight tracking-tighter">
                핵심가치 내재화<br />
                <span className="text-[#0047FF]">AI와 함께, 직접 만든다.</span>
              </h1>
            </div>

            {/* Key Points Box */}
            <div className="border-2 sm:border-3 border-black shadow-[3px_3px_0px_#4B0082] sm:shadow-[4px_4px_0px_#4B0082] bg-purple-50 p-3 sm:p-4 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#4B0082] sm:hover:shadow-[6px_6px_0px_#4B0082] transition-all">
              <h3 className="font-black text-base sm:text-lg mb-2 border-b-2 border-black inline-block">WHAT?</h3>
              <ul className="text-xs sm:text-sm font-medium space-y-1.5 sm:space-y-2 list-disc list-inside">
                <li><strong className="bg-yellow-300 px-1">이케아 효과:</strong> 내가 만든 가치, 나의 신념</li>
                <li><strong className="bg-yellow-300 px-1">AI Co-creation:</strong> 비전/미션/Way 생성</li>
                <li><strong className="bg-yellow-300 px-1">멀티모달:</strong> 퀴즈, 게임, 이미지 형상화</li>
              </ul>
            </div>

            {/* Schedule */}
            <div className="bg-gray-100 border-2 border-black p-3 sm:p-4">
              <h3 className="font-black text-center mb-2 sm:mb-3 bg-black text-white inline-block px-2 text-sm sm:text-base">ONLINE SHOWCASE 일정</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-center">
                <div className="bg-white border border-black p-1.5 sm:p-2">
                  <span className="block text-gray-500">1차</span>
                  1.07(수) 14:00
                </div>
                <div className="bg-white border border-black p-1.5 sm:p-2">
                  <span className="block text-gray-500">2차</span>
                  1.07(수) 19:00
                </div>
                <div className="bg-white border border-black p-1.5 sm:p-2">
                  <span className="block text-gray-500">3차</span>
                  1.16(금) 15:00
                </div>
                <div className="bg-white border border-black p-1.5 sm:p-2">
                  <span className="block text-gray-500">4차</span>
                  1.16(금) 19:00
                </div>
              </div>
              <p className="text-center text-[10px] sm:text-xs mt-1.5 sm:mt-2 font-medium text-gray-600">장소: ZOOM 라이브 / 비용: 무료</p>
            </div>

            {/* CTA Button */}
            <a
              href="https://open.kakao.com/o/g3H4wBoc"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0047FF] text-white border-2 sm:border-3 border-black shadow-[3px_3px_0px_black] sm:shadow-[5px_5px_0px_black] block text-center py-3 sm:py-4 text-base sm:text-xl font-black no-underline hover:bg-blue-600 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_black] transition-all"
            >
              참가 신청: 단톡방 조인 🚀
            </a>
          </div>

          {/* Footer */}
          <div className="bg-gray-200 p-1.5 sm:p-2 text-center border-t-2 border-black flex-shrink-0">
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-500">JJ CREATIVE Edu with AI</p>
          </div>
        </div>

        {/* Don't Show Today Button */}
        <button
          onClick={handleDontShowToday}
          className="w-full mt-2 sm:mt-3 py-1.5 sm:py-2 bg-gray-800 text-white text-xs sm:text-sm font-bold border-2 border-black shadow-[2px_2px_0px_black] sm:shadow-[3px_3px_0px_black] hover:bg-gray-700 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_black] transition-all flex-shrink-0"
        >
          오늘은 그만 보기
        </button>
      </div>
    </div>
  );
};

export default EventPopup;
