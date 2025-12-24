
import React, { useState, useEffect, useCallback } from 'react';

interface WorkWayGameProps {
  onPointsEarned: (points: number) => void;
  onComplete: (finalScore: number) => void;
}

const STAGES = [
  { id: 1, word: "자기주도성", chars: ["자", "기", "주", "도", "성"], maxFlips: 7 },
  { id: 2, word: "공개와공유", chars: ["공", "개", "와", "공", "유"], maxFlips: 7 },
  { id: 3, word: "수평커뮤니케이션", chars: ["수", "평", "커", "뮤", "니", "케", "이", "션"], maxFlips: 9 }
];

const DECOYS = ["침", "묵", "방", "관", "무", "책", "임", "외", "면", "불", "신", "독"];

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
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]); // 현재 라운드에서 뒤집은 카드들
  const [isProcessing, setIsProcessing] = useState(false);
  const [attempts, setAttempts] = useState(0); // 시도 횟수

  const currentStage = STAGES[currentStageIdx];

  const initBoard = useCallback(() => {
    let deck: any[] = [];

    // 각 스테이지의 글자들 추가
    STAGES.forEach(stage => {
      stage.chars.forEach(char => {
        deck.push({ char, type: 'target', stageId: stage.id });
      });
    });

    // 방해 글자 추가
    DECOYS.forEach(char => {
      deck.push({ char, type: 'decoy', stageId: null });
    });

    // ID 부여 및 초기화
    deck = deck.map((item, index) => ({
      ...item,
      id: index,
      solved: false,
      flipped: false
    }));

    // 고정된 카드 배치
    const fixedOrder = [
      17, 4, 25, 11, 2, 19,
      8, 22, 0, 14, 27, 6,
      12, 3, 20, 9, 24, 15,
      1, 18, 26, 7, 13, 21,
      5, 23, 10, 16, 28, 29
    ];

    const orderedDeck = fixedOrder.map(idx => deck[idx] || deck[idx % deck.length]);
    setCards(orderedDeck);
  }, []);

  useEffect(() => {
    initBoard();
  }, [initBoard]);

  const startGame = () => {
    setGameState('playing');
    setCurrentStageIdx(0);
    setScore(0);
    setFlippedIndices([]);
    setAttempts(0);
    initBoard();
  };

  const handleCardClick = (index: number) => {
    if (gameState !== 'playing' || isProcessing) return;
    const card = cards[index];
    if (card.solved || card.flipped) return;

    // 이미 최대 개수만큼 뒤집었으면 더 이상 뒤집을 수 없음
    if (flippedIndices.length >= currentStage.maxFlips) return;

    // 카드 뒤집기
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    // 최대 개수에 도달하면 자동으로 체크
    if (newFlippedIndices.length === currentStage.maxFlips) {
      setIsProcessing(true);
      setTimeout(() => checkSelection(newFlippedIndices), 800);
    }
  };

  const checkSelection = (indices: number[]) => {
    const selectedCards = indices.map(idx => cards[idx]);
    const targetChars = [...currentStage.chars];

    // 선택한 카드들 중 현재 스테이지의 타겟 글자들이 모두 있는지 확인
    const selectedTargetChars = selectedCards
      .filter(card => card.stageId === currentStage.id)
      .map(card => card.char);

    // 타겟 글자 정렬해서 비교
    const sortedTarget = [...targetChars].sort().join('');
    const sortedSelected = [...selectedTargetChars].sort().join('');

    if (sortedTarget === sortedSelected) {
      handleSuccess(indices);
    } else {
      handleFailure(indices);
    }
  };

  const handleSuccess = (indices: number[]) => {
    // 현재 스테이지의 타겟 카드들만 solved로 변경
    const newCards = [...cards];
    indices.forEach(idx => {
      if (newCards[idx].stageId === currentStage.id) {
        newCards[idx].solved = true;
      } else {
        newCards[idx].flipped = false; // 타겟이 아닌 카드는 다시 뒤집기
      }
    });
    setCards(newCards);

    const bonus = 500;
    const newScore = score + bonus;
    setScore(newScore);
    onPointsEarned(bonus);
    setFeedback("🎉 STAGE CLEAR! +500");
    setFlippedIndices([]);

    setTimeout(() => {
      setFeedback(null);
      if (currentStageIdx + 1 < STAGES.length) {
        setCurrentStageIdx(prev => prev + 1);
        setAttempts(0);
        setIsProcessing(false);
      } else {
        setGameState('victory');
        onComplete(newScore);
      }
    }, 1500);
  };

  const handleFailure = (indices: number[]) => {
    setAttempts(prev => prev + 1);
    setFeedback("다시 시도해보세요!");

    setTimeout(() => {
      // 모든 뒤집은 카드 다시 뒤집기
      const newCards = [...cards];
      indices.forEach(idx => {
        if (!newCards[idx].solved) {
          newCards[idx].flipped = false;
        }
      });
      setCards(newCards);
      setFlippedIndices([]);
      setFeedback(null);
      setIsProcessing(false);
    }, 1200);
  };

  // 선택 초기화 버튼
  const handleReset = () => {
    if (isProcessing) return;
    const newCards = [...cards];
    flippedIndices.forEach(idx => {
      if (!newCards[idx].solved) {
        newCards[idx].flipped = false;
      }
    });
    setCards(newCards);
    setFlippedIndices([]);
  };

  // 확인 버튼 (최대 개수 전에 수동으로 체크)
  const handleCheck = () => {
    if (isProcessing || flippedIndices.length < currentStage.chars.length) return;
    setIsProcessing(true);
    checkSelection(flippedIndices);
  };

  const getCardStyle = (card: CardData) => {
    if (card.solved) {
      return 'bg-kakao-yellow border-kakao-brown'; // 완료된 라운드 - 카카오 노란색
    }
    if (card.flipped) {
      return 'bg-sky-100 border-sky-500'; // 뒤집힌 카드 - 하늘색
    }
    return 'bg-white border-black';
  };

  const getCardTextStyle = (card: CardData) => {
    if (card.solved) {
      return 'text-kakao-brown';
    }
    if (card.flipped) {
      return 'text-sky-600';
    }
    return 'text-kakao-brown';
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

        {/* 점수 */}
        <div className="bg-white dark:bg-gray-900 p-4 border-4 border-kakao-brown mb-4 shadow-[4px_4px_0px_0px_rgba(60,30,30,1)]">
          <span className="text-xs font-black text-gray-400 block">SCORE</span>
          <span className="text-3xl font-black text-blue-600">{score}</span>
        </div>

        {/* 현재 진행 상황 */}
        {gameState === 'playing' && (
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 border-2 border-blue-300 mb-4">
            <p className="text-xs font-black text-blue-600 dark:text-blue-400 mb-2">
              뒤집은 카드: {flippedIndices.length} / {currentStage.maxFlips}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: currentStage.maxFlips }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 border-2 ${i < flippedIndices.length ? 'bg-sky-500 border-sky-600' : 'bg-gray-200 border-gray-300'}`}
                />
              ))}
            </div>
            {flippedIndices.length > 0 && !isProcessing && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-500 text-white py-2 text-xs font-black border-2 border-black shadow-[2px_2px_0_0_black] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  초기화
                </button>
                {flippedIndices.length >= currentStage.chars.length && (
                  <button
                    onClick={handleCheck}
                    className="flex-1 bg-blue-600 text-white py-2 text-xs font-black border-2 border-black shadow-[2px_2px_0_0_black] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  >
                    확인하기
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 스테이지 진행 */}
        <div className="space-y-6 flex-1">
          {STAGES.map((stage, idx) => {
            const isCompleted = currentStageIdx > idx;
            const isCurrent = currentStageIdx === idx;

            // 현재 스테이지에서 찾은 글자들
            const foundChars = isCurrent
              ? flippedIndices
                  .map(i => cards[i])
                  .filter(card => card && card.stageId === stage.id)
                  .map(card => card.char)
              : [];

            return (
              <div
                key={stage.id}
                className={`transition-all duration-300 ${isCurrent ? 'opacity-100 scale-105' : 'opacity-40'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-black px-2 py-1 border-2 border-black ${isCompleted ? 'bg-kakao-yellow text-kakao-brown' : (isCurrent ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400')}`}>
                    STEP {stage.id}
                  </span>
                  <span className={`font-black ${isCompleted ? 'text-kakao-brown' : 'text-kakao-brown dark:text-white'}`}>{stage.word}</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {stage.chars.map((char, charIdx) => {
                    let isFound = false;
                    if (isCompleted) {
                      isFound = true;
                    } else if (isCurrent) {
                      // 중복 글자 처리
                      const countInTarget = stage.chars.slice(0, charIdx + 1).filter(c => c === char).length;
                      const countFound = foundChars.filter(c => c === char).length;
                      isFound = countFound >= countInTarget;
                    }

                    return (
                      <div
                        key={charIdx}
                        className={`w-8 h-10 border-b-4 flex items-center justify-center font-black transition-colors ${
                          isCompleted
                            ? 'border-kakao-yellow text-kakao-brown bg-kakao-yellow/30'
                            : isFound
                              ? 'border-sky-500 text-sky-600 bg-sky-50'
                              : 'border-gray-300 text-gray-300 bg-gray-100'
                        }`}
                      >
                        {isCompleted || isFound ? char : '?'}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center text-xs font-bold text-gray-400 italic">
          {feedback || (gameState === 'playing' ? `'${currentStage.word}'의 ${currentStage.chars.length}글자를 찾으세요!` : '')}
        </div>
      </div>

      <div className="flex-1 bg-kakao-yellow p-4 md:p-8 flex items-center justify-center relative min-h-[500px]">
        {gameState === 'start' && (
          <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-white p-8 max-w-sm w-full border-4 border-kakao-brown text-center shadow-[10px_10px_0px_0px_rgba(60,30,30,1)]">
              <h2 className="text-4xl font-black text-kakao-brown mb-4">WORD FINDER</h2>
              <p className="text-gray-600 font-bold mb-4 leading-relaxed">
                30장의 카드 속에 숨겨진<br/>
                <span className="text-blue-600">카카오 일하는 방식</span>을 찾으세요!
              </p>
              <div className="bg-gray-100 p-4 mb-6 text-left text-sm border-2 border-gray-200">
                <p className="font-black text-kakao-brown mb-2">🎯 게임 규칙</p>
                <ul className="text-gray-600 space-y-1 text-xs">
                  <li>• 카드를 뒤집어 WORK WAY 글자를 찾으세요</li>
                  <li>• 자기주도성/공개와공유: <span className="font-bold">7장</span>까지 열기 가능</li>
                  <li>• 수평커뮤니케이션: <span className="font-bold">9장</span>까지 열기 가능</li>
                  <li>• <span className="text-sky-600 font-bold">하늘색</span>: 뒤집은 카드</li>
                  <li>• <span className="text-kakao-brown font-bold bg-kakao-yellow/50 px-1">노란색</span>: 완료된 단어</li>
                </ul>
              </div>
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
          <div className="absolute inset-0 z-20 bg-blue-600/90 flex items-center justify-center p-6 overflow-y-auto">
            <div className="bg-white p-8 max-w-md w-full border-4 border-black text-center shadow-[10px_10px_0px_0px_black] my-4">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-black text-kakao-brown mb-2 uppercase italic">Mission Complete</h2>
              <p className="text-gray-600 font-bold mb-6">
                모든 가치를 성공적으로 찾았습니다!<br/>당신은 진정한 카카오 크루입니다.
              </p>
              <div className="bg-gray-100 p-4 mb-6 border-4 border-dashed border-gray-300">
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Game Score</p>
                 <p className="text-4xl font-black text-blue-600">{score} P</p>
              </div>

              {/* WORK WAY 복습 섹션 */}
              <div className="bg-kakao-yellow/20 p-4 rounded-xl border-2 border-kakao-yellow mb-6 text-left">
                <p className="text-xs font-black text-kakao-brown/60 mb-3 uppercase tracking-widest text-center">📚 Work Way 복습</p>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border-2 border-kakao-brown/10">
                    <p className="text-sm font-black text-kakao-brown">1. 자기주도성</p>
                    <p className="text-xs text-gray-600">스스로 목표를 설정하고 주도적으로 일을 추진합니다.</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border-2 border-kakao-brown/10">
                    <p className="text-sm font-black text-kakao-brown">2. 공개와 공유</p>
                    <p className="text-xs text-gray-600">정보와 지식을 투명하게 공개하고 함께 나눕니다.</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border-2 border-kakao-brown/10">
                    <p className="text-sm font-black text-kakao-brown">3. 수평 커뮤니케이션</p>
                    <p className="text-xs text-gray-600">직급에 관계없이 자유롭게 의견을 나눕니다.</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 font-bold">
                잠시 후 다음 단계로 이동합니다...
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 md:gap-4 w-full max-w-4xl">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`aspect-[3/4] relative cursor-pointer transition-all duration-300 preserve-3d group ${card.flipped || card.solved ? 'rotate-y-180' : ''} ${card.solved ? 'scale-95' : ''}`}
            >
              {/* 카드 뒷면 (?) */}
              <div className="absolute inset-0 backface-hidden flex items-center justify-center bg-kakao-brown border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
                <span className="text-2xl font-black text-kakao-yellow">?</span>
              </div>
              {/* 카드 앞면 (글자) */}
              <div className={`absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center border-2 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] ${getCardStyle(card)}`}>
                <span className={`text-2xl font-black ${getCardTextStyle(card)}`}>
                  {card.char}
                </span>
              </div>
            </div>
          ))}
        </div>

        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className={`text-3xl md:text-4xl font-black italic drop-shadow-xl px-6 py-3 rounded-xl ${
              feedback.includes('CLEAR')
                ? 'bg-blue-600 text-white'
                : 'bg-orange-500 text-white'
            }`}>
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
