
import React, { useEffect, useRef, useState } from 'react';

interface VisionGameProps {
  onGameOver: (score: number, isSuccess: boolean) => void;
}

const VisionGame: React.FC<VisionGameProps> = ({ onGameOver }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'success' | 'fail'>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wordIndex, setWordIndex] = useState(0);

  // Audio References
  const soundRefs = useRef({
    collect: new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3'),
    finish: new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'),
    crash: new Audio('https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3'),
  });

  const MISSION_WORDS = ["사람을", "이해하는", "기술로", "필요한", "미래를", "더", "가깝게"];
  const VISION_WORDS = ["새로운", "연결을", "통해", "더", "편리하고", "즐거운", "세상"];
  const ALL_WORDS = [...MISSION_WORDS, ...VISION_WORDS];

  const gameRef = useRef({
    isPlaying: false,
    speed: 7,
    playerLane: 2, // Start at 3rd lane (0, 1, 2)
    lanes: 8,
    laneWidth: 0,
    objects: [] as any[],
    frame: 0,
    spawnRate: 35,
    goalPhase: false,
    goalMoving: false,
    score: 0,
    lives: 3,
    wordIndex: 0
  });

  const requestRef = useRef<number>(0);

  useEffect(() => {
    // Preload sounds
    Object.values(soundRefs.current).forEach(audio => {
      audio.volume = 0.4;
      audio.load();
    });

    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        gameRef.current.laneWidth = rect.width / gameRef.current.lanes;
        updatePlayerPos();
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (!gameRef.current.isPlaying) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      
      if (x < rect.width / 2) {
        movePlayer(-1);
      } else {
        movePlayer(1);
      }
      e.preventDefault();
      e.stopPropagation();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameRef.current.isPlaying) return;
      if (e.repeat) return;
      if (e.key === 'ArrowLeft') {
        movePlayer(-1);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        movePlayer(1);
        e.preventDefault();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    const container = containerRef.current;
    container?.addEventListener('pointerdown', handlePointerDown);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      container?.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      gameRef.current.isPlaying = true;
      requestRef.current = requestAnimationFrame(gameLoop);
    } else {
      gameRef.current.isPlaying = false;
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState]);

  const movePlayer = (dir: number) => {
    const state = gameRef.current;
    const nextLane = state.playerLane + dir;
    if (nextLane >= 0 && nextLane < state.lanes) {
      state.playerLane = nextLane;
      updatePlayerPos();
    }
  };

  const updatePlayerPos = () => {
    if (playerRef.current) {
      const state = gameRef.current;
      const centerPos = (state.playerLane * state.laneWidth) + (state.laneWidth / 2);
      playerRef.current.style.left = `${centerPos}px`;
    }
  };

  const playSound = (type: 'collect' | 'finish' | 'crash') => {
    const audio = soundRefs.current[type];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  const startGame = () => {
    const state = gameRef.current;
    state.score = 0;
    state.lives = 3;
    state.wordIndex = 0;
    state.speed = 7;
    state.playerLane = 2;
    state.frame = 0;
    state.goalPhase = false;
    state.goalMoving = false;
    state.objects.forEach(o => o.el.remove());
    state.objects = [];
    setScore(0);
    setLives(3);
    setWordIndex(0);
    setGameState('playing');
    updatePlayerPos();
  };

  const gameLoop = () => {
    const state = gameRef.current;
    if (!state.isPlaying) return;
    state.frame++;
    if (state.frame % 600 === 0 && state.speed < 16) {
      state.speed += 0.5;
    }
    if (state.frame % state.spawnRate === 0) {
      spawnObject();
    }
    if (state.goalMoving) {
      const goalEl = document.getElementById('goal-line');
      if (goalEl && containerRef.current) {
        let currentGoalY = parseFloat(goalEl.style.top || "-100");
        currentGoalY += state.speed;
        goalEl.style.top = `${currentGoalY}px`;
        if (currentGoalY > containerRef.current.clientHeight - 120) {
           playSound('finish');
           handleGameEnd(true);
           return;
        }
      }
    }
    for (let i = state.objects.length - 1; i >= 0; i--) {
      const obj = state.objects[i];
      obj.y += state.speed;
      obj.el.style.top = `${obj.y}px`;
      if (obj.y > (containerRef.current?.clientHeight || 0) + 100) {
        obj.el.remove();
        state.objects.splice(i, 1);
        continue;
      }
      const playerY = (containerRef.current?.clientHeight || 0) - 100;
      if (obj.active && obj.lane === state.playerLane && Math.abs(obj.y - playerY) < 60) {
        handleCollision(obj);
      }
    }
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const spawnObject = () => {
    const state = gameRef.current;
    if (state.goalMoving) return;
    const lane = Math.floor(Math.random() * state.lanes);
    const laneCenter = (lane * state.laneWidth) + (state.laneWidth / 2);
    let type = 'obstacle';
    let content = '';
    let icon = ['🚧', '⛔', '🪨', '🛑', '📦'][Math.floor(Math.random() * 5)];
    if (!state.goalPhase && state.wordIndex < ALL_WORDS.length && Math.random() < 0.45) {
      type = 'passenger';
      content = ALL_WORDS[state.wordIndex];
      icon = ['🧍', '🏃', '🙋', '🧑‍💼', '👩‍💻'][Math.floor(Math.random() * 5)];
    }
    const el = document.createElement('div');
    el.className = 'absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10 pointer-events-none';
    el.innerHTML = `
      <div class="text-4xl filter drop-shadow-lg">${icon}</div>
      ${type === 'passenger' ? `<div class='absolute -top-10 bg-white text-[#3C1E1E] text-[20px] px-4 py-1.5 rounded-full border-2 border-[#FEE500] whitespace-nowrap font-bold shadow-md'>${content}</div>` : ''}
    `;
    el.style.left = `${laneCenter}px`;
    el.style.top = '-60px';
    roadRef.current?.appendChild(el);
    state.objects.push({ el, lane, y: -60, type, text: content, active: true });
  };

  const handleCollision = (obj: any) => {
    const state = gameRef.current;
    obj.active = false;
    if (obj.type === 'passenger') {
      state.score += 500;
      setScore(state.score);
      playSound('collect');
      obj.el.innerHTML = '<div class="text-4xl animate-ping">✨</div>';
      setTimeout(() => obj.el.remove(), 300);
      if (obj.text === ALL_WORDS[state.wordIndex]) {
        state.wordIndex++;
        setWordIndex(state.wordIndex);
        if (state.wordIndex === ALL_WORDS.length) {
          triggerGoalPhase();
        }
      }
    } else {
      state.lives--;
      state.score = Math.max(0, state.score - 1000);
      setScore(state.score);
      setLives(state.lives);
      playSound('crash');
      obj.el.innerHTML = '<div class="text-4xl animate-bounce">💥</div>';
      containerRef.current?.classList.add('animate-[shake_0.4s_ease-in-out]');
      setTimeout(() => containerRef.current?.classList.remove('animate-[shake_0.4s_ease-in-out]'), 400);
      if (state.lives <= 0) {
        handleGameEnd(false);
      } else {
        const prevSpeed = state.speed;
        state.speed = 2;
        setTimeout(() => { if(state.isPlaying) state.speed = prevSpeed; }, 1200);
      }
    }
  };

  const triggerGoalPhase = () => {
    gameRef.current.goalPhase = true;
    setTimeout(() => {
      if (gameRef.current.isPlaying) {
        gameRef.current.goalMoving = true;
      }
    }, 3000);
  };

  const handleGameEnd = (isSuccess: boolean) => {
    gameRef.current.isPlaying = false;
    setGameState(isSuccess ? 'success' : 'fail');
    onGameOver(gameRef.current.score, isSuccess);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#1a1a1a] overflow-hidden select-none touch-none font-sans">
      <div ref={roadRef} className="absolute inset-0 bg-[#2c2c2c] overflow-hidden">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={i} className="absolute h-full w-[2px] opacity-20 bg-white" style={{ left: `${(i / 8) * 100}%` }}></div>
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={`dash-${i}`} className="absolute h-full w-[1px] opacity-5 border-l border-dashed border-white" style={{ left: `${((i + 0.5) / 8) * 100}%` }}></div>
        ))}
      </div>
      <div id="goal-line" className="absolute w-full h-14 bg-kakao-yellow flex items-center justify-center font-black text-kakao-brown text-xl shadow-[0_0_30px_rgba(254,229,0,0.5)] -top-[120px] z-5">
         🏁 VISION STATION 🏁
      </div>
      <div className="absolute top-0 left-0 w-full p-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <div className="flex justify-between items-center text-white mb-2">
          <div className="flex gap-1 text-lg filter drop-shadow-md">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={`${i < lives ? 'text-red-500 scale-110' : 'text-white/10 grayscale'} transition-all duration-300`}>❤️</span>
            ))}
          </div>
          <div className="text-right">
            <span className="text-[9px] block opacity-60 font-black uppercase tracking-widest text-kakao-yellow">Score</span>
            <span className="text-2xl font-mono text-white drop-shadow-lg leading-none">{score.toLocaleString()}</span>
          </div>
        </div>
        <div className="bg-black/40 p-2.5 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md">
           <div className="flex justify-between items-center mb-1.5 px-1">
              <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Connect Progress</span>
              <span className="text-[9px] font-bold text-kakao-yellow">{wordIndex}/{ALL_WORDS.length}</span>
           </div>
           <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-kakao-yellow transition-all duration-500" style={{ width: `${(wordIndex / ALL_WORDS.length) * 100}%` }}></div>
           </div>
           <div className="flex flex-wrap gap-1">
             {ALL_WORDS.map((w, i) => (
               <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded-md transition-all duration-300 ${wordIndex > i ? 'bg-kakao-yellow text-kakao-brown font-black scale-105' : 'bg-white/5 text-white/20'}`}>
                 {w}
               </span>
             ))}
           </div>
        </div>
      </div>
      <div ref={playerRef} className="absolute bottom-24 transform -translate-x-1/2 z-20 flex flex-col items-center transition-[left] duration-150 ease-out" style={{ width: '45px' }}>
        <div className="text-5xl text-kakao-yellow filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]">
           <i className="fas fa-bus"></i>
        </div>
        <div className="mt-[-8px] bg-white text-kakao-brown text-[7px] font-black px-1.5 py-0.5 rounded-sm border border-kakao-brown/10 shadow-sm uppercase tracking-tighter">
          CREW BUS
        </div>
      </div>
      {gameState === 'start' && (
        <div className="absolute inset-0 z-[200] bg-kakao-yellow flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300">
           <div className="text-7xl mb-6 animate-bounce">🚌</div>
           <h1 className="text-4xl font-black text-kakao-brown mb-2 tracking-tighter">Kakao Value Drive</h1>
           <p className="text-[10px] font-black text-kakao-brown/40 mb-10 tracking-[0.3em] uppercase">8-Lane Challenge</p>
           <div className="bg-white/95 p-6 rounded-[32px] mb-10 w-full max-w-xs shadow-2xl border-b-4 border-kakao-brown/10">
              <div className="text-left space-y-4">
                 <div className="bg-kakao-yellow/20 p-3 rounded-xl border border-kakao-yellow/50 mb-2">
                    <p className="text-[10px] font-black text-kakao-brown/60 mb-1 uppercase">🎯 Game Story</p>
                    <p className="text-xs font-bold text-kakao-brown leading-relaxed">
                      카카오의 <strong className="text-kakao-brown">미션 & 비전</strong>을 담은 크루들을<br/>
                      버스에 태워 <strong className="text-kakao-brown">비전 스테이션</strong>으로 운행하세요!<br/>
                      <span className="text-[10px] text-kakao-brown/70">모든 가치 키워드를 수집하면 미션 & 비전이 완성됩니다.</span>
                    </p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-gray-300 mb-1.5 uppercase tracking-widest">Mission Goal</p>
                    <p className="text-xs font-bold text-kakao-brown leading-relaxed">모든 가치 키워드를 순서대로 수집하세요!<br/>장애물 충돌 시 <strong>-1,000점</strong> 감점됩니다.</p>
                 </div>
                 <div className="h-[1px] bg-gray-100"></div>
                 <div>
                    <p className="text-[9px] font-black text-gray-300 mb-1.5 uppercase tracking-widest">Controls</p>
                    <div className="flex flex-col gap-2 text-[10px] font-bold text-kakao-brown/70">
                       <span>⌨️ 방향키 (한 칸씩 이동)</span>
                       <span>🖱️ 화면 좌/우 클릭 (한 칸씩 이동)</span>
                    </div>
                 </div>
              </div>
           </div>
           <button onClick={startGame} className="bg-kakao-brown text-white px-14 py-5 rounded-full font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all">
             드라이브 시작
           </button>
        </div>
      )}
      {gameState === 'success' && (
        <div className="absolute inset-0 z-[200] bg-white flex flex-col items-center justify-center p-8 text-center animate-in slide-in-from-bottom duration-500">
           <div className="text-8xl mb-8">🎖️</div>
           <h1 className="text-4xl font-black text-kakao-brown mb-3">도착 완료!</h1>
           <p className="text-gray-500 mb-12 leading-relaxed">카카오의 비전 스테이션에 도달했습니다.<br/>수집한 에너지가 포인트로 전환되었습니다.</p>
           <div className="bg-kakao-yellow p-10 rounded-[50px] w-full max-w-xs mb-12 shadow-2xl">
              <p className="text-xs font-black text-kakao-brown/30 uppercase tracking-[0.2em] mb-2">Internal Points</p>
              <p className="text-5xl font-black text-kakao-brown">{score.toLocaleString()} P</p>
           </div>
           <button onClick={() => setGameState('start')} className="bg-kakao-brown text-white px-16 py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-xl">
             재시작 하기
           </button>
        </div>
      )}
      {gameState === 'fail' && (
        <div className="absolute inset-0 z-[200] bg-[#111] text-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
           <div className="text-8xl mb-8 grayscale opacity-50">🛠️</div>
           <h1 className="text-4xl font-black text-red-500 mb-4">운행 중단</h1>
           <p className="text-gray-400 mb-14 leading-relaxed max-w-xs">사고로 인해 비전 스테이션 도달에 실패했습니다. 다시 시도해 주세요.</p>
           <button onClick={() => setGameState('start')} className="bg-white text-kakao-brown px-16 py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl">
             재시도하기
           </button>
        </div>
      )}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-15px); }
          50% { transform: translateX(15px); }
          75% { transform: translateX(-15px); }
        }
      `}</style>
    </div>
  );
};

export default VisionGame;
