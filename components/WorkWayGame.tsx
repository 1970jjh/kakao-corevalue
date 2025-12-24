
import React, { useState, useEffect, useCallback } from 'react';

interface WorkWayGameProps {
  onPointsEarned: (points: number) => void;
  onComplete: (finalScore: number) => void;
}

const STAGES = [
  { id: 1, word: "자기주도성", chars: ["자", "기", "주", "도", "성"], length: 5 },
  { id: 2, word: "공개와공유", chars: ["공", "개", "와", "공", "유"], length: 5 },
  { id: 3, word: "수평커뮤니케이션", chars: ["수", "평", "커", "뮤", "니", "케", "션"], length: 7 }
];

const DECOYS = ["침", "묵", "방", "관", "무", "책", "임", "외", "면", "불", "신", "독", "존"];

interface CardData {
  char: string;
  id: number;
  type: 'target' | 'decoy';
  stageId: number | null;
  solved: boolean;
  flipped: boolean;
}

const WorkWayGame: React.FC<WorkWayGameProps> = ({ onPointsEarned, onComplete }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'victory'>('start');
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentSelection, setCurrentSelection] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const initBoard = useCallback(() => {
    let deck: any[] = [];
    STAGES.forEach(stage => {
      stage.chars.forEach(char => {
        deck.push({ char, type: 'target', stageId: stage.id });
      });
    });
    DECOYS.forEach(char => {
      deck.push({ char, type: 'decoy', stageId: null });
    });

    deck = deck.map((item, index) => ({ 
      ...item, 
      id: index, 
      solved: false, 
      flipped: false 
    }));
    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
  }, []);

  useEffect(() => {
    initBoard();
  }, [initBoard]);

  const startGame = () => {
    setGameState('playing');
    setCurrentStageIdx(0);
    setScore(0);
    initBoard();
  };

  const handleCardClick = (index: number) => {
    if (gameState !== 'playing' || isProcessing) return;
    const card = cards[index];
    if (card.solved || card.flipped) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newSelection = [...currentSelection, index];
    setCurrentSelection(newSelection);

    if (newSelection.length === STAGES[currentStageIdx].length) {
      setIsProcessing(true);
      setTimeout(() => checkSelection(newSelection), 600);
    }
  };

  const checkSelection = (selection: number[]) => {
    const selectedChars = selection.map(idx => cards[idx].char);
    const targetChars = STAGES[currentStageIdx].chars;
    const isMatch = [...selectedChars].sort().join('') === [...targetChars].sort().join('');
    if (isMatch) {
      handleSuccess(selection);
    } else {
      handleFailure(selection);
    }
  };

  const handleSuccess = (indices: number[]) => {
    const newCards = [...cards];
    indices.forEach(idx => {
      newCards[idx].solved = true;
    });
    setCards(newCards);
    const bonus = 500;
    const newScore = score + bonus;
    setScore(newScore);
    onPointsEarned(bonus);
    setCurrentSelection([]);
    setIsProcessing(false);
    setFeedback("GREAT! STAGE CLEAR!");
    setTimeout(() => setFeedback(null), 1000);

    if (currentStageIdx + 1 < STAGES.length) {
      setCurrentStageIdx(prev => prev + 1);
    } else {
      setGameState('victory');
      onComplete(newScore); // Pass final score
    }
  };

  const handleFailure = (indices: number[]) => {
    const penalty = -100;
    setScore(prev => Math.max(0, prev + penalty));
    onPointsEarned(penalty);
    setFeedback("TRY AGAIN!");
    setTimeout(() => {
      const newCards = [...cards];
      indices.forEach(idx => {
        newCards[idx].flipped = false;
      });
      setCards(newCards);
      setCurrentSelection([]);
      setIsProcessing(false);
      setFeedback(null);
    }, 1000);
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row font-sans bg-white dark:bg-gray-900 select-none">
      <div className="lg:w-80 p-8 border-b-4 lg:border-b-0 lg:border-r-4 border-kakao-brown dark:border-gray-800 bg-gray-50 dark:bg-gray-800 flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full border-4 border-kakao-brown overflow-hidden bg-kakao-yellow shrink-0">
            <img 
              src="https://i.namu.wiki/i/h5gTVbR7kDn-bBshoThHnt42y68U48Jiln6DIpK-TwDXLrk6G_bu7l6egvkD_iNYPBkGbY028XxO2CYjHJ0oMA.webp" 
              alt="Chunsik" className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-kakao-brown dark:text-kakao-yellow leading-none mb-1 uppercase">Work Way</h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Word Finder Game</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 border-4 border-kakao-brown mb-8 flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(60,30,30,1)]">
          <span className="text-xs font-black text-gray-400">SCORE</span>
          <span className="text-3xl font-black text-blue-600">{score}</span>
        </div>
        <div className="space-y-6 flex-1">
          {STAGES.map((stage, idx) => (
            <div 
              key={stage.id} 
              className={`transition-all duration-300 ${currentStageIdx === idx ? 'opacity-100 scale-105' : 'opacity-30'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-black px-2 py-1 border-2 border-black ${currentStageIdx > idx ? 'bg-green-500 text-white' : (currentStageIdx === idx ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400')}`}>
                  STEP {stage.id}
                </span>
                <span className="font-black text-kakao-brown dark:text-white">{stage.word}</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {stage.chars.map((char, charIdx) => {
                  const isFilled = currentStageIdx > idx || (currentStageIdx === idx && currentSelection.length > charIdx);
                  const displayChar = currentStageIdx > idx ? char : (isFilled ? cards[currentSelection[charIdx]]?.char : '');
                  return (
                    <div 
                      key={charIdx} 
                      className={`w-8 h-10 border-b-4 flex items-center justify-center font-black transition-colors ${isFilled ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-300 text-gray-200 bg-gray-100'}`}
                    >
                      {displayChar}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-xs font-bold text-gray-400 italic">
          {feedback || (gameState === 'playing' ? `카드 속에서 '${STAGES[currentStageIdx].word}'를 찾으세요!` : '')}
        </div>
      </div>
      <div className="flex-1 bg-kakao-yellow p-4 md:p-8 flex items-center justify-center relative min-h-[500px]">
        {gameState === 'start' && (
          <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-white p-8 max-w-sm w-full border-4 border-kakao-brown text-center shadow-[10px_10px_0px_0px_rgba(60,30,30,1)]">
              <h2 className="text-4xl font-black text-kakao-brown mb-4">WORD FINDER</h2>
              <p className="text-gray-600 font-bold mb-8 leading-relaxed">
                30장의 카드 속에 숨겨진<br/>
                <span className="text-blue-600">카카오 일하는 방식</span>을 찾으세요!
              </p>
              <button 
                onClick={startGame}
                className="w-full bg-kakao-brown text-kakao-yellow py-4 rounded-none border-4 border-black font-black text-xl shadow-[4px_4px_0_0_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                START GAME
              </button>
            </div>
          </div>
        )}
        {gameState === 'victory' && (
          <div className="absolute inset-0 z-20 bg-blue-600/90 flex items-center justify-center p-6">
            <div className="bg-white p-10 max-w-sm w-full border-4 border-black text-center shadow-[10px_10px_0px_0px_black]">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-4xl font-black text-kakao-brown mb-2 uppercase italic">Mission Complete</h2>
              <p className="text-gray-600 font-bold mb-8">
                모든 가치를 성공적으로 찾았습니다!<br/>당신은 진정한 카카오 크루입니다.
              </p>
              <div className="bg-gray-100 p-4 mb-8 border-4 border-dashed border-gray-300">
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Game Score</p>
                 <p className="text-4xl font-black text-blue-600">{score} P</p>
              </div>
              <button 
                onClick={() => location.reload()}
                className="w-full bg-kakao-brown text-kakao-yellow py-4 rounded-none border-4 border-black font-black text-xl shadow-[4px_4px_0_0_black]"
              >
                FINISH
              </button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 md:gap-4 w-full max-w-4xl">
          {cards.map((card, idx) => (
            <div 
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`aspect-[3/4] relative cursor-pointer transition-all duration-300 preserve-3d group ${card.flipped || card.solved ? 'rotate-y-180' : ''} ${card.solved ? 'opacity-40 scale-95 pointer-events-none' : ''}`}
            >
              <div className="absolute inset-0 backface-hidden flex items-center justify-center bg-kakao-brown border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
                <span className="text-2xl font-black text-kakao-yellow">?</span>
              </div>
              <div className={`absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] ${card.solved ? 'bg-green-100 border-green-500' : 'bg-white'}`}>
                <span className={`text-2xl font-black ${card.solved ? 'text-green-600' : 'text-kakao-brown'}`}>
                  {card.char}
                </span>
              </div>
            </div>
          ))}
        </div>
        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 animate-bounce">
            <div className={`text-4xl font-black italic drop-shadow-xl ${feedback.includes('GREAT') ? 'text-blue-600' : 'text-red-600'}`}>
              {feedback}
            </div>
          </div>
        )}
      </div>
      <style>{`
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .preserve-3d { transform-style: preserve-3d; }
      `}</style>
    </div>
  );
};

export default WorkWayGame;
