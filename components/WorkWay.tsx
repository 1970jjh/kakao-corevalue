
import React, { useState, useRef } from 'react';
import WorkWayGame from './WorkWayGame';

interface WorkWayProps {
  onAddPoints: (points: number) => void;
  onComplete: (points: number) => void;
}

const WorkWay: React.FC<WorkWayProps> = ({ onAddPoints, onComplete }) => {
  const [isGameOpen, setIsGameOpen] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const [currentScore, setCurrentScore] = useState(0);

  const ways = [
    {
      title: "자기주도성",
      eng: "Proactivity",
      desc: "누군가 시켜서 하는 일이 아닌, 스스로 일의 본질을 고민하고 업무를 수행합니다.",
      icon: "fa-rocket",
    },
    {
      title: "공개와 공유",
      eng: "Open & Share",
      desc: "과정과 고민의 맥락까지 투명하게 공유하여 정보 격차를 없애고 집단 지성을 극대화합니다.",
      icon: "fa-share-alt",
    },
    {
      title: "수평 커뮤니케이션",
      eng: "Horizontal",
      desc: "직급 없이 영어 이름을 부르며 치열하게 토론하고 솔직하게 피드백을 주고받습니다.",
      icon: "fa-comments",
    }
  ];

  const handleToggleGame = () => {
    setIsGameOpen(!isGameOpen);
    if (!isGameOpen) {
      setTimeout(() => {
        gameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleGameEnd = (finalScore: number) => {
    onComplete(finalScore); 
  };

  return (
    <section id="workway-section" className="py-32 bg-kakao-yellow dark:bg-gray-800 transition-colors relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-kakao-brown dark:text-kakao-yellow font-black text-lg tracking-widest uppercase mb-4">Work Culture</h2>
          <h3 className="text-4xl md:text-5xl font-black text-kakao-brown dark:text-white mb-8">카카오가 일하는 방식 (Work Way)</h3>
          <p className="text-xl text-kakao-brown/80 dark:text-gray-400">우리는 신뢰를 바탕으로 충돌하고 헌신합니다.</p>
        </div>

        <div className="space-y-12 mb-20">
          {ways.map((way, idx) => (
            <div 
              key={way.title}
              className={`flex flex-col md:flex-row items-center gap-12 p-8 md:p-16 bg-white/90 dark:bg-kakao-black/40 backdrop-blur-md rounded-[40px] shadow-xl hover:-translate-y-2 transition-transform ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="w-40 h-40 bg-kakao-yellow flex items-center justify-center rounded-full flex-shrink-0 shadow-inner">
                <i className={`fas ${way.icon} text-6xl text-kakao-brown`}></i>
              </div>
              <div className={`flex-1 ${idx % 2 === 1 ? 'md:text-right' : ''}`}>
                <h4 className="text-3xl font-black text-kakao-brown dark:text-kakao-yellow mb-4">
                  {way.title} <span className="text-lg font-normal opacity-60 ml-2">({way.eng})</span>
                </h4>
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto md:mx-0">
                  {way.desc}
                </p>
                <div className={`mt-8 flex gap-4 ${idx % 2 === 1 ? 'md:justify-end' : ''}`}>
                  <span className="px-4 py-2 bg-kakao-yellow/20 rounded-full text-sm font-bold text-kakao-brown dark:text-gray-300">#Trust</span>
                  <span className="px-4 py-2 bg-kakao-yellow/20 rounded-full text-sm font-bold text-kakao-brown dark:text-gray-300">#Clash</span>
                  <span className="px-4 py-2 bg-kakao-yellow/20 rounded-full text-sm font-bold text-kakao-brown dark:text-gray-300">#Commit</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
           <button 
             onClick={handleToggleGame}
             className="bg-kakao-brown text-kakao-yellow px-12 py-6 rounded-full font-black text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all group border-4 border-black/10"
           >
             {isGameOpen ? (
               <>게임 닫기</>
             ) : (
               <>우리가 일하는 방식 WORK WAY GAME <i className="fas fa-puzzle-piece ml-2 group-hover:rotate-12 transition-transform"></i></>
             )}
           </button>
        </div>

        {isGameOpen && (
          <div ref={gameRef} className="mt-16 w-full max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-[50px] border-[10px] border-kakao-brown overflow-hidden shadow-2xl animate-in zoom-in duration-700">
             <WorkWayGame onPointsEarned={onAddPoints} onComplete={handleGameEnd} />
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkWay;
