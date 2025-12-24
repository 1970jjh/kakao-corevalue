
import React, { useState, useEffect, useCallback } from 'react';

interface ValuePokerProps {
  onGameOver: (finalChips: number, isSuccess: boolean) => void;
}

const CORE_VALUES = {
  integrity: {
    id: 'integrity',
    title: "Integrity",
    desc: "사심 없는 판단과 행동",
    icon: "⚖️",
  },
  user: {
    id: 'user',
    title: "User-Centric",
    desc: "사용자 중심의 관점",
    icon: "❤️",
  },
  challenge: {
    id: 'challenge',
    title: "Challenge for Excellence",
    desc: "최고의 결과를 향한 집념",
    icon: "🔥",
  },
  team: {
    id: 'team',
    title: "Team Synergy",
    desc: "공동의 목표를 위한 팀 시너지",
    icon: "🤝",
  }
};

const SCENARIOS = [
  {
    text: "중요한 프로젝트 마감이 임박했는데, 동료가 갑작스런 개인 사정으로 업무 공백이 생겼습니다. 내 일도 바쁘지만, 이대로 두면 프로젝트 전체가 위험합니다.",
    correct: 'team',
    reason: "'나' 혼자가 아닌 '우리'가 함께할 때 더 큰 성과를 냅니다. 동료를 돕는 것이 곧 우리의 목표 달성을 위한 길입니다."
  },
  {
    text: "새로 출시한 기능이 기술적으로는 완벽하지만, 베타 테스터들로부터 '사용하기 복잡하다'는 피드백이 들어왔습니다. 개발 일정을 맞추려면 그대로 출시해야 할까요?",
    correct: 'user',
    reason: "모든 생각의 출발점은 '사용자'입니다. 사용자가 불편함을 느낀다면, 그것은 우리가 추구하는 가치가 아닙니다. 다시 고민해야 합니다."
  },
  {
    text: "외부 파트너사가 계약 체결을 조건으로 개인적인 리베이트를 제안했습니다. 아무도 모를 것 같고, 회사 매출에도 도움이 될 것 같아 고민이 됩니다.",
    correct: 'integrity',
    reason: "개인의 이익보다 카카오의 미션을 최우선으로 생각하며, 투명하고 정직하게 판단해야 합니다. 사심 없는 판단이 핵심입니다."
  },
  {
    text: "현재 서비스 지표가 나쁘지 않습니다. 적당히 안정적으로 운영하며 워라밸을 챙길 수도 있지만, 경쟁사가 빠르게 추격해오고 있습니다.",
    correct: 'challenge',
    reason: "적당한 수준에서 타협하지 않고, 더 나은 답을 찾기 위해 치열하게 고민해야 합니다. 최고의 결과를 향해 끝까지 파고드세요."
  },
  {
    text: "팀 회의 중 내 의견과 정반대되는 의견이 나왔습니다. 감정적으로 기분이 나쁘지만, 곰곰이 생각해보니 그 의견이 서비스 발전에 더 도움이 될 것 같습니다.",
    correct: 'integrity',
    reason: "자존심보다는 '본질'에 맞는 올바른 길을 선택하는 것이 Integrity입니다. 사심을 버리고 무엇이 옳은지 판단하세요."
  },
  {
    text: "사용자 로그를 분석하던 중, 아주 드물게 발생하는 오류를 발견했습니다. 고치려면 시간이 꽤 걸리지만, 무시해도 당장 큰 문제는 없어 보입니다.",
    correct: 'challenge',
    reason: "타협하지 않는 집념이 필요합니다. 완벽한 서비스를 위해 아주 작은 불편함이라도 끝까지 해결하려는 노력이 Excellence를 만듭니다."
  },
  {
    text: "다른 팀에서 우리 팀의 데이터를 요청했습니다. 보안 규정상 애매한 부분이 있어 거절하고 싶지만, 그 데이터를 활용하면 전사적으로 큰 시너지가 날 것 같습니다.",
    correct: 'team',
    reason: "서로를 신뢰하고 협력하여 '원팀(One Team)'으로 움직여야 합니다. 규정을 준수하되, 협력할 방법을 적극적으로 찾아야 합니다."
  },
  {
    text: "화려하고 멋진 디자인의 UI 시안이 나왔습니다. 하지만 실제 사용성을 테스트해보니 버튼 위치가 낯설어 사용자가 헤매는 모습이 보입니다.",
    correct: 'user',
    reason: "심미성보다 중요한 것은 '사용자에게 꼭 필요한 가치인가'입니다. 사용자의 입장에서 불편함을 제거하는 것이 최우선입니다."
  }
];

const ValuePoker: React.FC<ValuePokerProps> = ({ onGameOver }) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'roundResult' | 'gameOver'>('intro');
  const [chips, setChips] = useState(1000);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [shuffledScenarios, setShuffledScenarios] = useState<any[]>([]);
  const [lastRoundInfo, setLastRoundInfo] = useState<any>(null);
  const [feedback, setFeedback] = useState<{ show: boolean, correct: boolean }>({ show: false, correct: false });

  const initGame = useCallback(() => {
    const shuffled = [...SCENARIOS].sort(() => Math.random() - 0.5);
    setShuffledScenarios(shuffled);
    setChips(1000);
    setWrongCount(0);
    setCurrentRound(0);
    setGameState('intro');
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const startGame = () => setGameState('playing');

  const playCard = (selectedId: string) => {
    if (gameState !== 'playing') return;
    const scenario = shuffledScenarios[currentRound];
    const isCorrect = selectedId === scenario.correct;
    
    setFeedback({ show: true, correct: isCorrect });
    setTimeout(() => setFeedback({ show: false, correct: false }), 1000);

    const chipChange = isCorrect ? 200 : -100;
    const newChips = Math.max(0, chips + chipChange);
    setChips(newChips);

    if (!isCorrect) {
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);
      // Immediately check for 2nd failure
      if (newWrongCount >= 2) {
        setLastRoundInfo({
          isCorrect,
          scenario,
          correctValue: (CORE_VALUES as any)[scenario.correct]
        });
        setTimeout(() => {
          setGameState('gameOver');
          onGameOver(newChips, false);
        }, 1200);
        return;
      }
    }

    setLastRoundInfo({
      isCorrect,
      scenario,
      correctValue: (CORE_VALUES as any)[scenario.correct]
    });

    setTimeout(() => {
      setGameState('roundResult');
    }, 1200);
  };

  const nextRound = () => {
    if (currentRound + 1 >= shuffledScenarios.length) {
      setGameState('gameOver');
      onGameOver(chips, true); // Completed all rounds with < 2 mistakes
    } else {
      setCurrentRound(prev => prev + 1);
      setGameState('playing');
    }
  };

  return (
    <div className="w-full h-full bg-[#1a1a1a] flex flex-col relative overflow-hidden font-sans select-none">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[40px] border-kakao-brown rounded-full"></div>
      </div>
      <div className="relative z-10 flex justify-between items-center p-6 md:p-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 text-kakao-yellow font-black text-xl tracking-tighter">
            <i className="fas fa-crown text-2xl"></i>
            <span>VALUE POKER</span>
          </div>
          <div className="flex gap-2 mt-2">
            {[...Array(2)].map((_, i) => (
              <span key={i} className={`text-xl transition-opacity duration-300 ${i < (2 - wrongCount) ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                ❤️
              </span>
            ))}
            <span className="text-[10px] text-white/40 font-black uppercase self-center ml-2">Chances</span>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-black/60 px-6 py-3 rounded-full border-2 border-kakao-yellow shadow-[0_0_20px_rgba(254,229,0,0.3)]">
           <div className="w-7 h-7 bg-red-600 rounded-full border-2 border-dashed border-white flex items-center justify-center text-[10px] font-bold">CHIP</div>
           <span className="text-2xl font-mono font-black text-kakao-yellow tracking-widest">{chips.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        {gameState === 'playing' && shuffledScenarios[currentRound] && (
          <div className="w-full max-w-2xl bg-white rounded-3xl p-10 shadow-2xl animate-in zoom-in duration-500 border-t-8 border-kakao-yellow">
             <div className="inline-block bg-gray-900 text-white text-[10px] font-black px-4 py-1 rounded-full mb-6 uppercase tracking-[0.3em]">
               Work Scenario {currentRound + 1} / {shuffledScenarios.length}
             </div>
             <p className="text-2xl font-bold text-gray-800 leading-relaxed text-center break-keep">
               {shuffledScenarios[currentRound].text}
             </p>
          </div>
        )}
        {feedback.show && (
          <div className="absolute inset-0 flex items-center justify-center z-[50] pointer-events-none animate-in zoom-in duration-300">
             <div className={`text-7xl font-black italic drop-shadow-2xl ${feedback.correct ? 'text-kakao-yellow' : 'text-red-500'}`}>
                {feedback.correct ? 'EXCELLENT!' : 'WRONG!'}
             </div>
          </div>
        )}
      </div>
      <div className="p-8 pb-12 flex justify-center gap-4 md:gap-6 relative z-10">
        {Object.values(CORE_VALUES).map((val) => (
          <button
            key={val.id}
            onClick={() => playCard(val.id)}
            disabled={gameState !== 'playing'}
            className={`group w-32 md:w-40 h-44 md:h-56 bg-white rounded-2xl flex flex-col items-center justify-center p-4 shadow-xl transition-all duration-300 transform 
              ${gameState === 'playing' ? 'hover:-translate-y-12 hover:rotate-2 hover:shadow-kakao-yellow/40 active:scale-95' : 'opacity-40'}
            `}
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{val.icon}</div>
            <div className="text-sm font-black text-gray-900 mb-1 leading-tight text-center">{val.title}</div>
            <div className="text-[9px] font-bold text-gray-400 text-center leading-tight">{val.desc}</div>
          </button>
        ))}
      </div>
      {gameState === 'intro' && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 text-center">
           <div className="bg-white rounded-[40px] p-12 max-w-lg shadow-2xl border-4 border-kakao-yellow animate-in zoom-in duration-300">
              <div className="text-6xl mb-6">🃏</div>
              <h1 className="text-3xl font-black text-kakao-brown mb-4">Kakao Value Poker</h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                업무 중 마주하는 다양한 선택의 순간!<br/>
                카카오의 <strong>4가지 핵심가치 카드</strong> 중<br/>
                가장 적절한 판단을 내리세요.<br/><br/>
                <span className="text-red-500 font-bold underline">단 2번의 기회만 주어집니다!</span>
              </p>
              <button onClick={startGame} className="bg-kakao-brown text-kakao-yellow px-12 py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-xl">
                게임 시작
              </button>
           </div>
        </div>
      )}
      {gameState === 'roundResult' && lastRoundInfo && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
           <div className="bg-white rounded-[40px] p-10 max-w-xl w-full shadow-2xl border-4 border-kakao-yellow animate-in slide-in-from-bottom duration-500">
              <div className="text-center mb-6">
                 <div className="text-6xl mb-4">{lastRoundInfo.isCorrect ? '🎉' : '🤔'}</div>
                 <h2 className={`text-3xl font-black mb-2 ${lastRoundInfo.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                    {lastRoundInfo.isCorrect ? '정답입니다!' : '아쉽습니다!'}
                 </h2>
                 <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">판정 결과</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-3xl border-l-8 border-kakao-yellow mb-8">
                 <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{lastRoundInfo.correctValue.icon}</span>
                    <span className="text-lg font-black text-kakao-brown">{lastRoundInfo.correctValue.title}</span>
                 </div>
                 <p className="text-gray-600 text-sm leading-relaxed italic">
                    "{lastRoundInfo.scenario.reason}"
                 </p>
              </div>
              <button onClick={nextRound} className="w-full bg-kakao-brown text-kakao-yellow py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-xl">
                 다음 라운드
              </button>
           </div>
        </div>
      )}
      {gameState === 'gameOver' && (
        <div className={`absolute inset-0 z-[100] flex flex-col items-center justify-center p-8 text-center text-white ${wrongCount >= 2 ? 'bg-red-900' : 'bg-kakao-brown'}`}>
           <div className="text-8xl mb-8 animate-bounce">
              {wrongCount >= 2 ? '💀' : '🏆'}
           </div>
           <h1 className="text-5xl font-black mb-4">
              {wrongCount >= 2 ? '미션 실패!' : '게임 종료!'}
           </h1>
           <p className="text-xl text-gray-400 mb-12">
              {wrongCount >= 2 
                ? '기회를 모두 소진했습니다. 카카오의 핵심 가치를 다시 한번 생각해보세요.' 
                : '당신의 가치 판단은 카카오 크루로서 매우 훌륭한 수준입니다.'
              }
           </p>
           
           <div className={`p-10 rounded-[50px] w-full max-w-sm mb-12 shadow-2xl ${wrongCount >= 2 ? 'bg-white/10' : 'bg-kakao-yellow'}`}>
              <p className={`text-xs font-black uppercase tracking-[0.2em] mb-2 ${wrongCount >= 2 ? 'text-white/40' : 'text-kakao-brown/40'}`}>
                 Final Chips Score
              </p>
              <p className={`text-6xl font-black ${wrongCount >= 2 ? 'text-white' : 'text-kakao-brown'}`}>
                 {chips.toLocaleString()} P
              </p>
           </div>

           {wrongCount >= 2 ? (
             <div className="mb-8">
                <p className="text-white font-bold mb-4">2회 오답으로 인해 탈락하였습니다.</p>
                <button onClick={initGame} className="bg-white text-red-900 px-16 py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-xl">
                  다시 도전하기
                </button>
             </div>
           ) : (
             <>
               <p className="text-gray-400 text-sm mb-8">성공적으로 모든 라운드를 마쳤습니다!</p>
               <button onClick={() => location.reload()} className="bg-white text-kakao-brown px-16 py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-xl">
                 결과 확인 및 계속하기
               </button>
             </>
           )}
        </div>
      )}
    </div>
  );
};

export default ValuePoker;
