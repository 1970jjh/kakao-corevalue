
import React, { useState, useRef } from 'react';
import VisionGame from './VisionGame';

interface MissionVisionProps {
  onAddPoints: (p: number) => void;
  onComplete: (p: number) => void;
}

const MissionVision: React.FC<MissionVisionProps> = ({ onAddPoints, onComplete }) => {
  const [isGameOpen, setIsGameOpen] = useState(false);
  const gameSectionRef = useRef<HTMLDivElement>(null);

  const handleGameEnd = (score: number, isSuccess: boolean) => {
    onAddPoints(score);
    if (isSuccess) {
      onComplete(score); // Pass score to ensure correct point display in the modal
    }
  };

  const handleStartGame = () => {
    setIsGameOpen(true);
    setTimeout(() => {
      gameSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <section id="mission-section" className="py-32 bg-gray-100 dark:bg-gray-900 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 relative">
          <h2 className="text-kakao-yellow font-black text-lg tracking-widest uppercase mb-4">Our North Star</h2>
          <h3 className="text-4xl md:text-5xl font-black text-kakao-brown dark:text-white mb-6">카카오의 존재 이유: 미션 & 비전</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">카카오는 무엇을 위해 존재하며, 어디를 향해 나아가고 있을까요?</p>
        </div>

        <div className="grid grid-cols-1 gap-12 mb-20">
          <div className="bg-white dark:bg-gray-800 rounded-[40px] shadow-xl overflow-hidden hover:scale-[1.01] transition-transform duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-12 md:p-16 flex flex-col justify-center">
                <div className="w-16 h-16 bg-kakao-yellow rounded-2xl flex items-center justify-center mb-8 text-2xl text-kakao-brown">
                  <i className="fas fa-compass"></i>
                </div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Mission</h4>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  사람을 이해하는 기술로,<br/>
                  <span className="text-kakao-brown dark:text-kakao-yellow">필요한 미래를 더 가깝게</span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  카카오는 사람에 대한 깊은 이해를 바탕으로 기술을 통해 일상의 문제를 해결합니다. 
                  우리의 기술은 단순한 편리함을 넘어 사용자에게 진정으로 필요한 내일을 만듭니다.
                </p>
              </div>
              <div 
                className="bg-cover bg-center h-80 md:h-auto opacity-100"
                style={{ backgroundImage: `url('https://img.onnada.com/2017/1212/2156292364_3e2be79c_EAB780EC97BD.gif')` }}
              ></div>
            </div>
          </div>

          <div className="bg-kakao-brown dark:bg-black text-white rounded-[40px] shadow-xl overflow-hidden hover:scale-[1.01] transition-transform duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div 
                className="bg-cover bg-center h-80 md:h-auto opacity-90 order-2 md:order-1"
                style={{ backgroundImage: `url('https://www.book21.com/flv/book_info24/gogo_kakao_32_01.jpg')` }}
              ></div>
              <div className="p-12 md:p-16 flex flex-col justify-center order-1 md:order-2">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-2xl text-kakao-yellow backdrop-blur-md">
                  <i className="fas fa-eye"></i>
                </div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Vision</h4>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  새로운 연결을 통해<br/>
                  <span className="text-kakao-yellow">더 편리하고 즐거운 세상</span>
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  모든 것을 연결하여 더 가치 있는 세상을 만듭니다. 
                  우리가 만드는 연결이 사람들의 삶에 긍정적인 변화와 즐거운 경험을 가져오기를 희망합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
           {!isGameOpen ? (
             <div className="bg-white dark:bg-gray-800 p-12 rounded-[50px] shadow-2xl inline-block max-w-2xl relative overflow-hidden group">
                <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-4">미션 & 비전 내재화 게임</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  카카오 버스를 몰고 도로 위의 핵심 키워드들을 수집해보세요!<br/>
                  도착지에 성공적으로 도달하면 <strong>핵심가치 스테이지</strong>가 열립니다.
                </p>
                <button 
                  onClick={handleStartGame}
                  className="bg-kakao-yellow text-kakao-brown px-12 py-5 rounded-full font-black text-xl shadow-xl hover:scale-105 transition-all hoverable active:scale-95"
                >
                  미션 & 비전 버스 운행하기 <i className="fas fa-gamepad ml-2"></i>
                </button>
             </div>
           ) : (
             <div ref={gameSectionRef} className="w-full max-w-2xl mx-auto h-[80vh] bg-gray-900 rounded-[50px] overflow-hidden border-8 border-kakao-yellow shadow-2xl animate-in slide-in-from-top-10 duration-700">
                <VisionGame onGameOver={handleGameEnd} />
             </div>
           )}
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
