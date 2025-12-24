
import React, { useEffect, useState } from 'react';

interface StageCompleteModalProps {
  isOpen: boolean;
  stageTitle: string;
  pointsEarned: number;
  nextMissionTitle: string;
  nextMissionDesc: string;
  onNext: () => void;
}

const StageCompleteModal: React.FC<StageCompleteModalProps> = ({
  isOpen,
  stageTitle,
  pointsEarned,
  nextMissionTitle,
  nextMissionDesc,
  onNext,
}) => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number; delay: number }[]>([]);

  useEffect(() => {
    if (isOpen) {
      const newParticles = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: ['#FEE500', '#FF5733', '#33FF57', '#3357FF', '#F333FF'][Math.floor(Math.random() * 5)],
        size: Math.random() * 15 + 5,
        delay: Math.random() * 2,
      }));
      setParticles(newParticles);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-kakao-brown/95 backdrop-blur-2xl animate-in fade-in duration-500">
      {/* Confetti Fanfare Layer */}
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
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`emoji-${i}`}
            className="absolute animate-[float_4s_ease-in-out_infinite] text-4xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.3
            }}
          >
            {['🎉', '✨', '🎊', '⭐️', '🏆', '🔥'][i % 6]}
          </div>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-gray-800 rounded-[60px] p-8 md:p-16 max-w-2xl w-full text-center shadow-[0_0_120px_rgba(254,229,0,0.6)] border-[12px] border-kakao-yellow relative animate-in zoom-in duration-700 overflow-visible">
        {/* Huge Animated Trophy */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 text-[120px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-bounce">
           🏆
        </div>

        <div className="pt-12">
          <h2 className="text-kakao-yellow font-black text-2xl tracking-[0.5em] uppercase mb-4 animate-pulse">MISSION CLEAR!</h2>
          <h1 className="text-4xl md:text-6xl font-black text-kakao-brown dark:text-white mb-10 break-keep leading-tight">
            대단합니다!<br/><span className="text-blue-600 dark:text-kakao-yellow underline decoration-8 decoration-kakao-yellow/30">{stageTitle}</span> 클리어
          </h1>

          <div className="relative mb-12 group">
            <div className="absolute -inset-2 bg-gradient-to-r from-kakao-yellow via-white to-kakao-yellow rounded-[45px] animate-pulse opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-white dark:bg-gray-900 p-10 rounded-[40px] border-4 border-kakao-brown dark:border-gray-700 shadow-xl">
               <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3">누적 획득 포인트</p>
               <div className="flex items-center justify-center gap-4">
                  <span className="text-6xl font-black text-blue-600 dark:text-kakao-yellow">+{pointsEarned.toLocaleString()}</span>
                  <span className="text-2xl font-black text-kakao-brown dark:text-gray-400">PTS</span>
               </div>
            </div>
          </div>

          <div className="text-left mb-14 bg-gray-50 dark:bg-gray-700/50 p-8 rounded-[40px] border-2 border-gray-100 dark:border-gray-600 shadow-inner">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-kakao-brown rounded-full flex items-center justify-center text-kakao-yellow text-sm">
                   <i className="fas fa-arrow-right animate-bounce-x"></i>
                </div>
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Next Level</p>
                   <h4 className="text-2xl font-black text-gray-900 dark:text-white">{nextMissionTitle}</h4>
                </div>
             </div>
             <p className="text-gray-600 dark:text-gray-300 font-bold leading-relaxed text-lg pl-2">
                {nextMissionDesc}
             </p>
          </div>

          <button
            onClick={onNext}
            className="w-full bg-kakao-brown text-kakao-yellow py-8 rounded-full font-black text-3xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all hoverable group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-4">
               다음 도전에 참여하기 
               <i className="fas fa-chevron-right group-hover:translate-x-3 transition-transform"></i>
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
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
        .animate-bounce-x { animation: bounce-x 1s infinite; }
      `}</style>
    </div>
  );
};

export default StageCompleteModal;
