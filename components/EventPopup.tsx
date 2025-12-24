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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative max-w-[500px] w-full animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 z-10 w-10 h-10 bg-white border-3 border-black rounded-full shadow-[3px_3px_0px_black] flex items-center justify-center font-black text-xl hover:bg-red-500 hover:text-white transition-colors"
          aria-label="닫기"
        >
          ✕
        </button>

        {/* Poster Container */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_black] overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white p-3 text-center">
            <h2 className="text-xs font-mono tracking-widest text-yellow-400">2026 HR/OD INNOVATION</h2>
          </div>

          {/* Main Content */}
          <div className="p-6 flex flex-col gap-5">
            {/* Catchphrase */}
            <div className="text-center">
              <p className="text-sm font-bold text-gray-500 mb-1">"언제까지 수첩만 나눠주시겠습니까?"</p>
              <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-tighter">
                핵심가치 내재화<br />
                <span className="text-[#0047FF]">AI와 함께, 직접 만든다.</span>
              </h1>
            </div>

            {/* Key Points Box */}
            <div className="border-3 border-black shadow-[4px_4px_0px_#4B0082] bg-purple-50 p-4 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#4B0082] transition-all">
              <h3 className="font-black text-lg mb-2 border-b-2 border-black inline-block">WHAT?</h3>
              <ul className="text-sm font-medium space-y-2 list-disc list-inside">
                <li><strong className="bg-yellow-300 px-1">이케아 효과:</strong> 내가 만든 가치, 나의 신념</li>
                <li><strong className="bg-yellow-300 px-1">AI Co-creation:</strong> 비전/미션/Way 생성</li>
                <li><strong className="bg-yellow-300 px-1">멀티모달:</strong> 퀴즈, 게임, 이미지 형상화</li>
              </ul>
            </div>

            {/* Schedule */}
            <div className="bg-gray-100 border-2 border-black p-4">
              <h3 className="font-black text-center mb-3 bg-black text-white inline-block px-2">ONLINE SHOWCASE 일정</h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-center">
                <div className="bg-white border border-black p-2">
                  <span className="block text-gray-500">1차</span>
                  1.07(수) 14:00
                </div>
                <div className="bg-white border border-black p-2">
                  <span className="block text-gray-500">2차</span>
                  1.07(수) 19:00
                </div>
                <div className="bg-white border border-black p-2">
                  <span className="block text-gray-500">3차</span>
                  1.16(금) 15:00
                </div>
                <div className="bg-white border border-black p-2">
                  <span className="block text-gray-500">4차</span>
                  1.16(금) 19:00
                </div>
              </div>
              <p className="text-center text-xs mt-2 font-medium text-gray-600">장소: ZOOM 라이브 / 비용: 무료</p>
            </div>

            {/* CTA Button */}
            <a
              href="https://open.kakao.com/o/g3H4wBoc"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0047FF] text-white border-3 border-black shadow-[5px_5px_0px_black] block text-center py-4 text-xl font-black no-underline hover:bg-blue-600 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_black] transition-all"
            >
              참가 신청: 단톡방 조인 🚀
            </a>
          </div>

          {/* Footer */}
          <div className="bg-gray-200 p-2 text-center border-t-2 border-black">
            <p className="text-[10px] font-bold text-gray-500">JJ CREATIVE Edu with AI</p>
          </div>
        </div>

        {/* Don't Show Today Button */}
        <button
          onClick={handleDontShowToday}
          className="w-full mt-3 py-2 bg-gray-800 text-white text-sm font-bold border-2 border-black shadow-[3px_3px_0px_black] hover:bg-gray-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_black] transition-all"
        >
          오늘은 그만 보기
        </button>
      </div>
    </div>
  );
};

export default EventPopup;
