
import React, { useState, useRef } from 'react';
import { CoreValue } from '../types';
import ValuePoker from './ValuePoker';

interface CoreValuesProps {
  onAddPoints: (points: number) => void;
  onComplete: (points: number) => void;
}

const VALUES: CoreValue[] = [
  {
    title: "Integrity",
    subtitle: "사심 없는 판단과 행동",
    icon: "fa-balance-scale",
    description: "개인의 이익보다는 카카오 전체의 미션을 우선합니다. 투명하고 정직하게 판단하며, 본질에 맞는 올바른 길을 선택합니다.",
    inAction: "이 결정이 사용자에게 떳떳한가? 카카오의 미션에 부합하는가?"
  },
  {
    title: "User-Centric",
    subtitle: "사용자 중심의 관점",
    icon: "fa-heart",
    description: "모든 생각의 출발점은 사용자입니다. 사용자의 입장에서 불편함을 찾고, 사용자에게 꼭 필요한 가치인지 질문합니다.",
    inAction: "우리가 만들고 싶은 기능보다, 사용자가 겪는 불편함 해결에 집중합니다."
  },
  {
    title: "Challenge for Excellence",
    subtitle: "최고의 결과를 향한 집념",
    icon: "fa-mountain",
    description: "적당한 수준에서 타협하지 않고, 최고의 결과를 위해 치열하게 고민합니다. 더 나은 답을 찾기 위한 노력을 멈추지 않습니다.",
    inAction: "마지막 디테일 하나까지 놓치지 않고 완성도를 높입니다."
  },
  {
    title: "Team Synergy",
    subtitle: "공동의 목표를 위한 시너지",
    icon: "fa-puzzle-piece",
    description: "나보다 우리가 함께할 때 더 큰 성과를 낼 수 있음을 믿습니다. 서로를 신뢰하고 협력하며 원팀으로 움직여야 합니다.",
    inAction: "동료의 성공이 곧 나의 성공임을 알고 지식을 공유합니다."
  }
];

const CoreValues: React.FC<CoreValuesProps> = ({ onAddPoints, onComplete }) => {
  const [isPokerOpen, setIsPokerOpen] = useState(false);
  const gameSectionRef = useRef<HTMLDivElement>(null);

  const handlePokerEnd = (finalChips: number, isSuccess: boolean) => {
    onAddPoints(finalChips);
    if (isSuccess) {
      onComplete(finalChips); // Pass final chips to show in modal
    }
  };

  const startPoker = () => {
    setIsPokerOpen(true);
    setTimeout(() => {
      gameSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <section id="values-section" className="py-32 bg-white dark:bg-kakao-black relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-kakao-yellow font-black text-lg tracking-widest uppercase mb-4">핵심가치(Core Values)</h2>
          <h3 className="text-4xl md:text-5xl font-black text-kakao-brown dark:text-white mb-8">카카오스러움의 원천</h3>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            우리가 일하는 방식과 결정하는 기준이 되는 4가지 핵심 가치입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {VALUES.map((val) => (
            <div 
              key={val.title}
              className="group bg-gray-50 dark:bg-gray-800 p-10 rounded-3xl hover:bg-kakao-yellow transition-all duration-500 hoverable cursor-default border-2 border-transparent hover:border-kakao-brown/10"
            >
              <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                <i className={`fas ${val.icon} text-3xl text-gray-900 dark:text-white`}></i>
              </div>
              <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-kakao-brown">{val.title}</h4>
              <h5 className="text-lg font-bold text-kakao-yellow dark:text-kakao-yellow mb-6 group-hover:text-kakao-brown/80">{val.subtitle}</h5>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed group-hover:text-kakao-brown">
                {val.description}
              </p>
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700 group-hover:border-kakao-brown/20">
                <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-kakao-brown/60 mb-2 block">In Action</span>
                <p className="text-sm font-medium italic text-gray-500 group-hover:text-kakao-brown">
                  "{val.inAction}"
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
           <div className="bg-kakao-brown text-white p-12 rounded-[50px] shadow-2xl relative overflow-hidden group border-b-8 border-black/20">
              <h4 className="text-3xl font-black mb-4 uppercase tracking-tighter">핵심가치 Core Value Challenge</h4>
              <p className="text-gray-300 mb-10 max-w-xl mx-auto leading-relaxed">
                다양한 딜레마 상황에서 어떤 가치를 선택해야 할까요?<br/>
                포커 게임을 통해 <strong>카카오 크루의 판단력</strong>을 증명하고 Work Way를 해제하세요!
              </p>
              
              {!isPokerOpen ? (
                <button 
                  onClick={startPoker}
                  className="bg-kakao-yellow text-kakao-brown px-12 py-5 rounded-full font-black text-xl shadow-xl hover:scale-105 transition-all hoverable active:scale-95 relative z-10"
                >
                  포커 게임 시작하기 <i className="fas fa-playing-cards ml-2"></i>
                </button>
              ) : (
                <button 
                  onClick={() => setIsPokerOpen(false)}
                  className="bg-white/10 text-white border border-white/20 px-12 py-5 rounded-full font-black text-xl shadow-xl hover:bg-white/20 transition-all hoverable active:scale-95 relative z-10"
                >
                  게임 닫기
                </button>
              )}
           </div>
        </div>

        {isPokerOpen && (
          <div ref={gameSectionRef} className="w-full max-w-6xl mx-auto h-[700px] bg-[#222] rounded-[50px] shadow-2xl overflow-hidden border-8 border-kakao-brown/50 animate-in zoom-in duration-700 relative">
              <ValuePoker onGameOver={handlePokerEnd} />
          </div>
        )}
      </div>
    </section>
  );
};

export default CoreValues;
