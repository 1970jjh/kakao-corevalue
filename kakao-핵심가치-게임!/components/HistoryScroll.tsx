
import React, { useState, useEffect, useRef } from 'react';

interface QuizOption {
  label: string;
  isCorrect: boolean;
}

interface Era {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
  points: number;
  characterImg: string;
  quiz: {
    question: string;
    options: QuizOption[];
  };
}

const ERAS: Era[] = [
  {
    id: 'era-1',
    date: '2010.03',
    title: '국민 메신저의 탄생',
    description: '스마트폰 시대의 개막과 함께, 무료 모바일 메신저가 세상에 등장했습니다. 사람과 사람을 연결하는 새로운 방식은 대한민국 전체의 소통 방식을 바꾸어 놓았습니다.',
    image: '', 
    characterImg: 'https://mblogthumb-phinf.pstatic.net/MjAyNTAyMjdfMzgg/MDAxNzQwNjUxMTYxNjUx.DwwOMpvR0fQyKjsF8CuRcOmOIMQJU_z3lvQ8uE9FqLkg.oerRcQUe3q8bFYLyjHwj7ZdNYktIaj1sVZ27s1oTJRIg.PNG/1739778769788.png?type=w400',
    points: 100,
    quiz: {
      question: '2010년 3월, 스마트폰 시대를 연 카카오의 첫 대표 서비스는?',
      options: [
        { label: '가. 카카오톡', isCorrect: true },
        { label: '나. 카카오스토리', isCorrect: false },
        { label: '다. 카카오아지트', isCorrect: false },
      ],
    },
  },
  {
    id: 'era-2',
    date: '2012.03',
    title: '전 국민의 SNS, 카카오스토리',
    description: '카카오톡 친구들과 소중한 일상을 공유하는 모바일 SNS 서비스가 출시되었습니다. 런칭 9일 만에 1,000만 가입자를 돌파하며 모바일 소셜의 새 시대를 열었습니다.',
    image: '',
    characterImg: 'https://i.namu.wiki/i/h5gTVbR7kDn-bBshoThHnt42y68U48Jiln6DIpK-TwDXLrk6G_bu7l6egvkD_iNYPBkGbY028XxO2CYjHJ0oMA.webp',
    points: 100,
    quiz: {
      question: '런칭 9일 만에 1,000만 가입자를 돌파한 카카오의 SNS 서비스는?',
      options: [
        { label: '가. 카카오픽', isCorrect: false },
        { label: '나. 카카오스토리', isCorrect: true },
        { label: '다. 카카오헬로', isCorrect: false },
      ],
    },
  },
  {
    id: 'era-3',
    date: '2012.07',
    title: '애니팡과 게임하기의 열풍',
    description: '카카오톡이 단순한 메신저를 넘어 게임 플랫폼으로 진화했습니다. 친구들과 순위 경쟁을 벌이는 "게임하기"는 모바일 게임 시장의 폭발적 성장을 견인했습니다.',
    image: '',
    characterImg: 'https://i.namu.wiki/i/vDDaVK4wm1-vPZgAOI65rbhLhr1vPCzBgoRKSS7mEFx4IH2vtHvvMN41Umw-taptksIW_WqnjwOdcGbAMpAmrQ.webp',
    points: 100,
    quiz: {
      question: '2012년 하반기, 전국적인 하트 주고받기 열풍을 일으킨 플랫폼은?',
      options: [
        { label: '가. 카카오 게임하기', isCorrect: true },
        { label: '나. 카카오 뮤직', isCorrect: false },
        { label: '다. 카카오 페이지', isCorrect: false },
      ],
    },
  },
  {
    id: 'era-4',
    date: '2014.10',
    title: '새로운 시작, 다음카카오',
    description: "국내 2위 포털 사이트와의 합병을 통해 '다음카카오'가 출범했습니다. 모바일 플랫폼 강자와 인터넷 콘텐츠 강자의 결합으로 시너지를 극대화하며 생활 플랫폼으로 도약했습니다.",
    image: '',
    characterImg: 'https://i.namu.wiki/i/1Vj5JYbrrTcIuhF3AVpd_bhidLhhOZUWhR9zBnZ4a8W8QEpmXwu0O6HMqL2PlipguJB9eQROu3B3xtXqNKp9ww.webp',
    points: 150,
    quiz: {
      question: '2014년 카카오와 합병하며 생활 플랫폼으로의 도약을 함께한 포털은?',
      options: [
        { label: '가. 네이트', isCorrect: false },
        { label: '나. 파란', isCorrect: false },
        { label: '다. 다음(Daum)', isCorrect: true },
      ],
    },
  },
  {
    id: 'era-5',
    date: '2015.03',
    title: '이동의 혁신, 카카오택시',
    description: '모바일 클릭 한 번으로 택시를 부르는 새로운 이동 문화가 시작되었습니다. 카카오택시는 O2O(Online to Offline) 서비스의 성공 모델이 되었습니다.',
    image: '',
    characterImg: 'https://t1.kakaocdn.net/kakaofriend_ip/static/images/home/img_kakaofriends.png',
    points: 150,
    quiz: {
      question: '카카오 모빌리티의 시작을 알린 첫 번째 혁신 서비스는?',
      options: [
        { label: '가. 카카오 드라이버', isCorrect: false },
        { label: '나. 카카오 택시', isCorrect: true },
        { label: '다. 카카오 맵', isCorrect: false },
      ],
    },
  },
  {
    id: 'era-6',
    date: '2017.07',
    title: '은행을 내 손안에, 카카오뱅크',
    description: "'같지만 다른 은행'이라는 슬로건과 함께 인터넷 전문 은행이 출범했습니다. 간편한 이체와 귀여운 캐릭터 디자인으로 금융 혁신을 이끌었습니다.",
    image: '',
    characterImg: 'https://t1.kakaocdn.net/kakaofriend_ip/static/images/kakaoFriends/img_friends1.png',
    points: 200,
    quiz: {
      question: '2017년 출범하여 공인인증서 없는 금융 혁신을 이끈 서비스는?',
      options: [
        { label: '가. 카카오 페이', isCorrect: false },
        { label: '나. 카카오 뱅크', isCorrect: true },
        { label: '다. 카카오 카드', isCorrect: false },
      ],
    },
  },
  {
    id: 'era-7',
    date: '2022.03',
    title: 'Beyond Korea & AI Revolution',
    description: '"기술과 사람으로 더 나은 세상을 만듭니다." 카카오는 이제 글로벌 시장으로 나아가며, AI 기술 혁신을 통해 모든 영역을 지능화하고 있습니다.',
    image: '',
    characterImg: 'https://t1.kakaocorp.net/kakaocorp/kakaocorp/admin/service/70020734019900001.png',
    points: 200,
    quiz: {
      question: '카카오가 현재 집중하고 있는 글로벌 진출 및 기술 혁신 키워드는?',
      options: [
        { label: '가. Beyond Korea', isCorrect: true },
        { label: '나. Hello World', isCorrect: false },
        { label: '다. Only One Kakao', isCorrect: false },
      ],
    },
  },
];

const QUIZ_TIME_LIMIT = 7;

interface HistoryScrollProps {
  totalPoints: number;
  onAddPoints: (p: number) => void;
  onComplete: (p: number) => void;
}

const HistoryScroll: React.FC<HistoryScrollProps> = ({ totalPoints, onAddPoints, onComplete }) => {
  const [solvedQuizzes, setSolvedQuizzes] = useState<Set<number>>(new Set());
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<{ [key: number]: number }>({});
  const [showPointAnim, setShowPointAnim] = useState(false);
  const [lastEarned, setLastEarned] = useState(0);
  const [stagePoints, setStagePoints] = useState(0);
  const [isFailed, setIsFailed] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_LIMIT);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startQuiz = () => {
    setQuizStarted(true);
    setSolvedQuizzes(new Set());
    setCurrentQuizIdx(0);
    setWrongAnswers({});
    setStagePoints(0);
    setTimeLeft(QUIZ_TIME_LIMIT);
  };

  const resetQuizProgress = () => {
    setQuizStarted(false);
    setTimerActive(false);
    setSolvedQuizzes(new Set());
    setCurrentQuizIdx(0);
    setWrongAnswers({});
    setStagePoints(0);
    setTimeLeft(QUIZ_TIME_LIMIT);
    setIsFailed(true);
    setTimeout(() => setIsFailed(false), 2000);
  };

  useEffect(() => {
    if (quizStarted && currentQuizIdx < ERAS.length && !solvedQuizzes.has(currentQuizIdx)) {
      setTimeLeft(QUIZ_TIME_LIMIT);
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [quizStarted, currentQuizIdx, solvedQuizzes]);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0.1) {
             if (timerRef.current) window.clearInterval(timerRef.current);
             resetQuizProgress();
             return 0;
          }
          return Math.max(0, prev - 0.1);
        });
      }, 100);
    } else {
      if (timerRef.current) window.clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [timerActive, timeLeft]);

  const handleQuizAnswer = (eraIndex: number, isCorrect: boolean, optionIndex: number) => {
    if (!quizStarted || solvedQuizzes.has(eraIndex) || isFailed) return;

    if (isCorrect) {
      setTimerActive(false);
      const bonus = Math.floor(timeLeft * 30);
      const earned = ERAS[eraIndex].points + bonus;
      
      setLastEarned(earned);
      const newStagePoints = stagePoints + earned;
      setStagePoints(newStagePoints);
      onAddPoints(earned);
      setShowPointAnim(true);
      setTimeout(() => setShowPointAnim(false), 2000);

      const nextSolved = new Set(solvedQuizzes);
      nextSolved.add(eraIndex);
      setSolvedQuizzes(nextSolved);
      
      if (nextSolved.size === ERAS.length) {
        setTimeout(() => {
          onComplete(newStagePoints);
        }, 800);
      } else {
        setTimeout(() => {
          setCurrentQuizIdx(prev => prev + 1);
        }, 1500);
      }
    } else {
      setWrongAnswers({ ...wrongAnswers, [eraIndex]: optionIndex });
      setTimerActive(false);
      setTimeout(() => {
        resetQuizProgress();
      }, 600);
    }
  };

  const timePercent = (timeLeft / QUIZ_TIME_LIMIT) * 100;

  return (
    <section id="history-section" className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-kakao-yellow font-black text-lg tracking-widest uppercase mb-4">Level 1: History Archive</h2>
          <h3 className="text-4xl md:text-5xl font-black text-kakao-brown dark:text-white mb-6">카카오의 역사와 성장의 발자취 Quiz</h3>
          <p className="text-gray-500 max-w-2xl mx-auto">
            7개의 미션을 해결하세요! <br/>
            <strong>7초 이내</strong>에 정확한 답을 맞혀야 합니다. <br/>
            틀리거나 시간이 초과되면 <strong>1번 문제부터 다시 도전</strong>해야 합니다.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="lg:w-1/2 w-full sticky top-24">
            <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[50px] shadow-2xl border-4 border-kakao-yellow relative min-h-[500px] flex flex-col justify-center overflow-hidden">
               
               {isFailed && (
                 <div className="absolute inset-0 z-[110] bg-red-600/90 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
                    <i className="fas fa-undo-alt text-6xl mb-4 animate-spin"></i>
                    <h4 className="text-3xl font-black mb-2 text-center">미션 실패!<br/>처음부터 다시 시작합니다</h4>
                 </div>
               )}

               {!quizStarted && !isFailed ? (
                 <div className="text-center space-y-8 animate-in zoom-in duration-500">
                    <div className="w-32 h-32 bg-kakao-yellow rounded-full flex items-center justify-center mx-auto shadow-xl">
                       <i className="fas fa-play text-kakao-brown text-4xl ml-2"></i>
                    </div>
                    <div>
                       <h4 className="text-2xl font-black text-kakao-brown dark:text-white mb-2">역사 아카이브 퀴즈 준비 완료</h4>
                       <p className="text-gray-400 text-sm">준비가 되면 '시작하기' 버튼을 누르세요.</p>
                    </div>
                    <button 
                       onClick={startQuiz}
                       className="bg-kakao-brown text-kakao-yellow px-12 py-5 rounded-full font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                       시작하기
                    </button>
                 </div>
               ) : (
                 <>
                   {timerActive && (
                     <div className="absolute top-0 left-0 w-full h-3 bg-gray-100 dark:bg-gray-700">
                        <div 
                          className={`h-full transition-all duration-100 ease-linear ${
                            timePercent > 50 ? 'bg-green-500' : timePercent > 20 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${timePercent}%` }}
                        />
                     </div>
                   )}

                   <div className="absolute top-4 right-4 text-xs font-black text-kakao-brown/40 dark:text-gray-500">
                      {timerActive ? (
                        <div className="flex items-center gap-2">
                          <i className="fas fa-bolt text-kakao-yellow animate-pulse"></i>
                          <span className="text-2xl font-mono text-kakao-brown dark:text-kakao-yellow">
                            {timeLeft.toFixed(1)}s
                          </span>
                        </div>
                      ) : null}
                   </div>

                   <div className="flex justify-between items-center mb-10 pt-4">
                      <span className="bg-kakao-brown text-kakao-yellow px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                        Mission {currentQuizIdx + 1} / 7
                      </span>
                      <div className="text-right">
                        <span className="text-[10px] block font-black text-gray-400">TOTAL SCORE</span>
                        <span className="text-2xl font-black text-kakao-brown dark:text-kakao-yellow">{totalPoints.toLocaleString()}</span>
                      </div>
                   </div>

                   {currentQuizIdx < ERAS.length ? (
                     <div key={currentQuizIdx} className="animate-in fade-in slide-in-from-right-10 duration-500">
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
                           {ERAS[currentQuizIdx].quiz.question}
                        </h4>
                        
                        <div className="space-y-4">
                          {ERAS[currentQuizIdx].quiz.options.map((opt, optIdx) => {
                            const isSolved = solvedQuizzes.has(currentQuizIdx);
                            const isWrong = wrongAnswers[currentQuizIdx] === optIdx;
                            return (
                              <button
                                key={optIdx}
                                disabled={isSolved || timeLeft <= 0 || isFailed || solvedQuizzes.size === ERAS.length}
                                onClick={() => handleQuizAnswer(currentQuizIdx, opt.isCorrect, optIdx)}
                                className={`w-full p-6 rounded-3xl text-left font-bold transition-all border-2 flex justify-between items-center group
                                  ${isSolved && opt.isCorrect 
                                    ? 'bg-green-500 text-white border-green-500 shadow-lg scale-[1.02]' 
                                    : isWrong 
                                      ? 'bg-red-50 text-white border-red-500 animate-[shake_0.5s_ease-in-out]' 
                                      : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700 hover:border-kakao-yellow hover:bg-kakao-yellow/5 text-gray-700 dark:text-gray-300'
                                  }
                                  ${(timeLeft <= 0 || isFailed) && !isSolved ? 'opacity-50 grayscale' : ''}
                                `}
                              >
                                <span>{opt.label}</span>
                                {isSolved && opt.isCorrect ? (
                                   <div className="flex items-center gap-2">
                                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full animate-bounce">+{lastEarned} pts</span>
                                      <i className="fas fa-check-circle text-xl"></i>
                                   </div>
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                     </div>
                   ) : (
                     <div className="text-center py-10 animate-in zoom-in duration-700">
                        <div className="text-7xl mb-6">🏆</div>
                        <h4 className="text-3xl font-black text-kakao-brown dark:text-white mb-4">역사 미션 완료!</h4>
                        <p className="text-gray-500 font-bold mb-8">모든 발자취 카드를 성공적으로 수집했습니다.</p>
                        <div className="bg-kakao-yellow text-kakao-brown px-10 py-4 rounded-full font-black shadow-xl inline-block">축하합니다!</div>
                     </div>
                   )}
                 </>
               )}
            </div>
            
            <div className="mt-8 flex gap-2 overflow-x-auto pb-4">
               {ERAS.map((_, i) => (
                 <div 
                   key={i} 
                   className={`h-2 rounded-full transition-all duration-500 ${solvedQuizzes.has(i) ? 'w-8 bg-green-500' : (i === currentQuizIdx && quizStarted ? 'w-12 bg-kakao-yellow' : 'w-4 bg-gray-200 dark:bg-gray-700')}`}
                 ></div>
               ))}
            </div>
          </div>

          <div className="lg:w-1/2 w-full space-y-8">
             <div className="flex items-center gap-4 mb-8">
                <i className="fas fa-archive text-kakao-yellow text-2xl"></i>
                <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Unlocked History Cards</h4>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {ERAS.map((era, index) => {
                  const isSolved = solvedQuizzes.has(index);
                  return (
                    <div 
                      key={era.id} 
                      className={`relative aspect-[4/5] bg-white dark:bg-gray-800 rounded-[35px] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-700 
                        ${isSolved ? 'opacity-100 translate-y-0 scale-100' : 'opacity-40 translate-y-10 scale-95 grayscale'}`}
                    >
                       <div className="absolute top-6 left-6 z-10">
                          <span className="bg-kakao-brown text-white dark:bg-kakao-yellow dark:text-kakao-brown px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest">
                             {era.date}
                          </span>
                       </div>

                       <div className="p-8 pt-16 flex flex-col h-full">
                          <h5 className={`text-xl font-black text-gray-900 dark:text-white mb-4 leading-tight transition-all duration-700 ${!isSolved ? 'blur-md select-none' : 'blur-0'}`}>
                             {era.title}
                          </h5>
                          <p className={`text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium mb-auto transition-all duration-700 ${!isSolved ? 'blur-md select-none' : 'blur-0'}`}>
                             {era.description}
                          </p>
                          
                          <div className={`mt-4 flex justify-center transition-all duration-700 ${!isSolved ? 'blur-xl grayscale opacity-10' : 'blur-0 opacity-100'}`}>
                             <img 
                               src={era.characterImg} 
                               alt="Kakao Character" 
                               className="w-40 h-40 object-contain drop-shadow-2xl"
                             />
                          </div>
                       </div>
                       
                       {!isSolved && (
                         <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center pointer-events-none">
                            <i className="fas fa-lock text-3xl text-kakao-brown/20 mb-4"></i>
                            <p className="text-[10px] font-black text-kakao-brown/40 uppercase tracking-widest">Solve quiz to unlock details</p>
                         </div>
                       )}

                       {isSolved && (
                         <div className="absolute bottom-0 left-0 w-full h-1.5 bg-kakao-yellow animate-pulse"></div>
                       )}
                    </div>
                  );
                })}
             </div>
             
             {solvedQuizzes.size === 0 && !quizStarted && (
               <div className="text-center py-20 bg-gray-100/50 dark:bg-gray-800/50 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <p className="text-gray-400 font-bold px-8">퀴즈 미션을 해결하면 카카오의 소중한 순간들이 이곳에 공개됩니다.</p>
               </div>
             )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
          75% { transform: translateX(-10px); }
        }
      `}</style>
    </section>
  );
};

export default HistoryScroll;
