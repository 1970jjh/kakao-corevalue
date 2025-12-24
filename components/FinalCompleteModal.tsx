import React, { useEffect, useState } from 'react';

interface FinalCompleteModalProps {
  isOpen: boolean;
  userName: string;
  totalPoints: number;
  completionTime: string;
  onProceedToGuestbook: () => void;
}

const FinalCompleteModal: React.FC<FinalCompleteModalProps> = ({
  isOpen,
  userName,
  totalPoints,
  completionTime,
  onProceedToGuestbook
}) => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number; delay: number }[]>([]);

  useEffect(() => {
    if (isOpen) {
      const newParticles = Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: ['#FEE500', '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FFD700'][Math.floor(Math.random() * 6)],
        size: Math.random() * 20 + 5,
        delay: Math.random() * 2,
      }));
      setParticles(newParticles);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-gradient-to-br from-kakao-brown via-kakao-brown to-black backdrop-blur-2xl animate-in fade-in duration-500">
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full animate-ping opacity-60"
            style={{
              top: `${p.y}%`,
              left: `${p.x}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${1.5 + Math.random()}s`,
            }}
          />
        ))}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`emoji-${i}`}
            className="absolute animate-[float_4s_ease-in-out_infinite] text-4xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.4
            }}
          >
            {['🎉', '✨', '🎊', '⭐️', '🏆', '🔥', '💛', '🎯'][i % 8]}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-[60px] p-8 md:p-16 max-w-2xl w-full text-center shadow-[0_0_150px_rgba(254,229,0,0.8)] border-[12px] border-kakao-yellow relative animate-in zoom-in duration-700 overflow-visible">
        {/* Trophy */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 text-[100px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-bounce">
          🏆
        </div>

        <div className="pt-10">
          {/* Title */}
          <div className="mb-8">
            <h2 className="text-kakao-yellow font-black text-xl tracking-[0.3em] uppercase mb-4 animate-pulse">
              ALL MISSIONS CLEAR!
            </h2>
            <h1 className="text-3xl md:text-4xl font-black text-kakao-brown dark:text-white mb-4 leading-tight">
              KAKAO 핵심가치 내재화<br/>
              <span className="text-blue-600 dark:text-kakao-yellow">미션 클리어!</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-bold">
              {userName}님, 축하합니다!<br/>
              <span className="text-kakao-brown dark:text-kakao-yellow">당신은 이제 KAKAO 명예 사원입니다.</span>
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-3xl border-2 border-blue-200 dark:border-blue-700">
              <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Total Points</p>
              <p className="text-4xl font-black text-blue-600 dark:text-blue-400">
                {totalPoints.toLocaleString()}
                <span className="text-xl ml-1">P</span>
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-6 rounded-3xl border-2 border-orange-200 dark:border-orange-700">
              <p className="text-xs font-black text-orange-400 uppercase tracking-widest mb-2">Clear Time</p>
              <p className="text-2xl font-black text-orange-600 dark:text-orange-400">
                {completionTime}
              </p>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-kakao-yellow/20 p-6 rounded-3xl mb-10 border-2 border-kakao-yellow/50">
            <p className="text-sm font-bold text-kakao-brown/80 leading-relaxed">
              🎖️ 방명록을 작성하시면 <strong>명예 사원증</strong>이 발급됩니다!<br/>
              전체 순위에서 당신의 위치도 확인해보세요.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={onProceedToGuestbook}
            className="w-full bg-kakao-brown text-kakao-yellow py-7 rounded-full font-black text-2xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-4">
              방명록 쓰기
              <i className="fas fa-pen-fancy group-hover:rotate-12 transition-transform"></i>
            </span>
            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

export default FinalCompleteModal;
