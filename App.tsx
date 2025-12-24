
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Intro from './components/Intro';
import EntryQuest from './components/EntryQuest';
import HistoryScroll from './components/HistoryScroll';
import MissionVision from './components/MissionVision';
import CoreValues from './components/CoreValues';
import WorkWay from './components/WorkWay';
import Talent from './components/Talent';
import Voices from './components/Voices';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import AICultureAssistant from './components/AICultureAssistant';
import StageCompleteModal from './components/StageCompleteModal';
import FinalCompleteModal from './components/FinalCompleteModal';
import Guestbook from './components/Guestbook';
import HonoraryIdCard from './components/HonoraryIdCard';
import Leaderboard from './components/Leaderboard';
import { addLeaderboardEntry } from './services/firebase';

export type UnlockState = {
  entryQuest: boolean;
  history: boolean;
  mission: boolean;
  values: boolean;
  workWay: boolean;
};

interface CompletionInfo {
  isOpen: boolean;
  stageTitle: string;
  pointsEarned: number;
  nextMissionTitle: string;
  nextMissionDesc: string;
  targetStage: keyof UnlockState | 'final';
}

const App: React.FC = () => {
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [prevPoints, setPrevPoints] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<UnlockState>({
    entryQuest: true,
    history: false,
    mission: false,
    values: false,
    workWay: false,
  });

  // Final completion flow states
  const [userName, setUserName] = useState<string>('');
  const [completionTime, setCompletionTime] = useState<string>('');
  const [completionDate, setCompletionDate] = useState<string>('');
  const [showFinalModal, setShowFinalModal] = useState<boolean>(false);
  const [showGuestbook, setShowGuestbook] = useState<boolean>(false);
  const [showIdCard, setShowIdCard] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);

  const [modal, setModal] = useState<CompletionInfo>({
    isOpen: false,
    stageTitle: '',
    pointsEarned: 0,
    nextMissionTitle: '',
    nextMissionDesc: '',
    targetStage: 'entryQuest',
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // API Key selection state for Gemini 3 Pro models
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if an API key has been selected as per Gemini API guidelines for paid models
    const checkKey = async () => {
      if (typeof (window as any).aistudio !== 'undefined') {
        const has = await (window as any).aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      } else {
        setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  const handleOpenKey = async () => {
    // Open the API key selection dialog as per Gemini API guidelines
    if (typeof (window as any).aistudio !== 'undefined') {
      await (window as any).aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const addPoints = (points: number) => {
    setTotalPoints(prev => prev + points);
    if (!startTime) setStartTime(Date.now());
  };

  const handleStageComplete = (currentStage: keyof UnlockState, stagePoints?: number) => {
    const earned = stagePoints !== undefined ? stagePoints : (totalPoints - prevPoints);
    setPrevPoints(totalPoints + (stagePoints || 0));

    const configs: Record<keyof UnlockState, Partial<CompletionInfo>> = {
      entryQuest: {
        stageTitle: '카카오 크루 입성 환영회',
        nextMissionTitle: '역사 아카이브 퀴즈',
        nextMissionDesc: '카카오가 걸어온 길을 퀴즈로 풀어보세요. 7초의 제한 시간 내에 정답을 맞춰야 합니다!',
        targetStage: 'history',
      },
      history: {
        stageTitle: '카카오 역사 아카이브',
        nextMissionTitle: '미션 & 비전 드라이브',
        nextMissionDesc: '카카오 버스를 운전하며 도로 위의 가치 키워드를 수집하세요. 충돌 없이 정해진 목적지까지 도달해야 합니다!',
        targetStage: 'mission',
      },
      mission: {
        stageTitle: '미션 & 비전 스테이션',
        nextMissionTitle: '핵심가치 포커 챌린지',
        nextMissionDesc: '실제 업무 딜레마 상황에서 카카오 크루라면 어떤 가치를 선택해야 할까요? 당신의 판단력을 증명하세요.',
        targetStage: 'values',
      },
      values: {
        stageTitle: '핵심가치 마스터',
        nextMissionTitle: '워크웨이 단어 찾기',
        nextMissionDesc: '카카오가 일하는 방식(Work Way)이 카드 속에 숨겨져 있습니다. 짝을 맞춰 모든 문화를 해제하세요.',
        targetStage: 'workWay',
      },
      workWay: {
        stageTitle: '카카오 문화 정복',
        nextMissionTitle: '인재상 & 면접 시뮬레이션',
        nextMissionDesc: '마지막 관문입니다. 카카오가 찾는 인재상 면접을 통해 최종 합격 사원증을 발급받으세요!',
        targetStage: 'final',
      },
    };

    const config = configs[currentStage];
    setModal({
      isOpen: true,
      stageTitle: config.stageTitle || '',
      pointsEarned: earned,
      nextMissionTitle: config.nextMissionTitle || '',
      nextMissionDesc: config.nextMissionDesc || '',
      targetStage: config.targetStage as any,
    });
  };

  const proceedToNextStage = () => {
    const { targetStage } = modal;
    setModal(prev => ({ ...prev, isOpen: false }));

    if (targetStage !== 'final') {
      setUnlocked(prev => ({ ...prev, [targetStage]: true }));
      setTimeout(() => {
        const element = document.getElementById(targetStage as string);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    } else {
       setTimeout(() => {
         document.getElementById('talent-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
       }, 500);
    }
  };

  // Handle interview completion - triggers final celebration
  const handleInterviewComplete = async (name: string) => {
    setUserName(name);

    // Calculate completion time
    const endTime = Date.now();
    const elapsed = startTime ? endTime - startTime : 0;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const timeStr = `${minutes}분 ${seconds}초`;
    setCompletionTime(timeStr);

    // Set completion date
    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    setCompletionDate(dateStr);

    // Save to leaderboard
    try {
      await addLeaderboardEntry({
        userName: name,
        totalPoints,
        completionTime: timeStr,
      });
    } catch (error) {
      console.error('Failed to save to leaderboard:', error);
    }

    // Show final modal
    setShowFinalModal(true);
  };

  const handleProceedToGuestbook = () => {
    setShowFinalModal(false);
    setShowGuestbook(true);
    setTimeout(() => {
      document.getElementById('guestbook-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const handleGuestbookComplete = () => {
    setShowIdCard(true);
    setShowLeaderboard(true);
    setTimeout(() => {
      document.getElementById('idcard-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const LockedOverlay = ({ message, level }: { message: string, level: string }) => (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 dark:bg-kakao-black/80 backdrop-blur-xl transition-all duration-1000">
      <div className="bg-white dark:bg-gray-800 p-12 rounded-[50px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] border-4 border-kakao-yellow flex flex-col items-center group max-w-sm">
        <div className="relative mb-8">
           <i className="fas fa-lock text-7xl text-kakao-yellow group-hover:scale-110 transition-transform"></i>
           <span className="absolute -top-4 -right-4 bg-kakao-brown text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">{level} Locked</span>
        </div>
        <h4 className="text-2xl font-black text-kakao-brown dark:text-white mb-4 text-center">내재화가 필요한 단계입니다</h4>
        <p className="text-gray-500 text-center font-bold text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );

  if (hasApiKey === false) {
    return (
      <div className="min-h-screen bg-kakao-yellow flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[50px] shadow-2xl text-center max-w-md">
          <h1 className="text-3xl font-black text-kakao-brown mb-6 uppercase tracking-tighter">API Key Required</h1>
          <p className="text-gray-600 mb-8 font-bold leading-relaxed">
            환영 파티의 시네마틱 이미지 생성을 위해<br/>
            유료 GCP 프로젝트의 API 키 선택이 필요합니다.
          </p>
          <button 
            onClick={handleOpenKey}
            className="bg-kakao-brown text-white px-10 py-4 rounded-full font-black text-lg mb-8 hover:scale-105 transition-all shadow-xl"
          >
            API 키 선택하기
          </button>
          <div className="text-xs text-gray-400">
            상세 내용은 <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">빌링 문서</a>를 참조하세요.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <CustomCursor />
      <Header 
        toggleDarkMode={toggleDarkMode} 
        isDarkMode={darkMode} 
        totalPoints={totalPoints} 
        unlocked={unlocked}
      />
      
      <main>
        <Hero />
        <Intro />

        {/* Level 0: Entry Quest */}
        <div id="entryQuest" className="relative scroll-mt-20">
           <EntryQuest 
             onAddPoints={addPoints} 
             onPhotoUpload={(photo) => setUserPhoto(photo)}
             onComplete={(p) => handleStageComplete('entryQuest', p)} 
           />
        </div>
        
        {/* Section 1: History (Level 1) */}
        <div id="history" className="relative scroll-mt-20">
           {!unlocked.history && <LockedOverlay level="Lvl 1" message="Level 0: 카카오 프렌즈와 함께하는 파티 사진을 생성하고 다운로드해야 히스토리 미션이 열립니다!" />}
           <div className={unlocked.history ? "opacity-100 translate-y-0 transition-all duration-1000" : "opacity-20 translate-y-20 pointer-events-none blur-sm"}>
             <HistoryScroll 
               totalPoints={totalPoints} 
               onAddPoints={addPoints} 
               onComplete={(p) => handleStageComplete('history', p)} 
             />
           </div>
        </div>

        {/* Section 2: Mission & Vision (Level 2) */}
        <div id="mission" className="relative min-h-[500px] scroll-mt-20">
           {!unlocked.mission && <LockedOverlay level="Lvl 2" message="Level 1: 카카오 역사를 모두 학습하고 7개의 퀴즈를 완료해야 미션&비전 단계가 열립니다!" />}
           <div className={unlocked.mission ? "opacity-100 translate-y-0 transition-all duration-1000" : "opacity-20 translate-y-20 pointer-events-none blur-sm"}>
             <MissionVision 
               onAddPoints={addPoints} 
               onComplete={(p) => handleStageComplete('mission', p)}
             />
           </div>
        </div>

        {/* Section 3: Core Values (Level 3) */}
        <div id="values" className="relative min-h-[500px] scroll-mt-20">
           {!unlocked.values && <LockedOverlay level="Lvl 3" message="Level 2: 미션 & 비전 버스 운행을 성공해야 핵심가치 단계가 열립니다!" />}
           <div className={unlocked.values ? "opacity-100 translate-y-0 transition-all duration-1000" : "opacity-20 translate-y-20 pointer-events-none blur-sm"}>
             <CoreValues 
               onAddPoints={addPoints} 
               onComplete={(p) => handleStageComplete('values', p)}
             />
           </div>
        </div>

        {/* Section 4: Work Way (Level 4) */}
        <div id="workWay" className="relative min-h-[500px] scroll-mt-20">
           {!unlocked.workWay && <LockedOverlay level="Lvl 4" message="Level 3: 핵심가치 포커 챌린지를 완료해야 워크웨이 단계가 열립니다!" />}
           <div className={unlocked.workWay ? "opacity-100 translate-y-0 transition-all duration-1000" : "opacity-20 translate-y-20 pointer-events-none blur-sm"}>
             <WorkWay 
               onAddPoints={addPoints} 
               onComplete={(p) => handleStageComplete('workWay', p)}
             />
           </div>
        </div>

        {/* Final Reward Content */}
        <div className={unlocked.workWay ? "opacity-100 translate-y-0 transition-all duration-1000" : "opacity-0 h-0 overflow-hidden"}>
           <Talent
             userPhoto={userPhoto}
             totalPoints={totalPoints}
             startTime={startTime}
             onAddPoints={addPoints}
             onInterviewComplete={handleInterviewComplete}
           />
           <Voices />
        </div>

        {/* Guestbook Section */}
        {showGuestbook && (
          <div id="guestbook-section" className="animate-in slide-in-from-bottom duration-700">
            <Guestbook
              userName={userName}
              totalPoints={totalPoints}
              completionTime={completionTime}
              onComplete={handleGuestbookComplete}
            />
          </div>
        )}

        {/* Honorary ID Card Section */}
        {showIdCard && (
          <div id="idcard-section" className="animate-in slide-in-from-bottom duration-700">
            <HonoraryIdCard
              userName={userName}
              userPhoto={userPhoto}
              totalPoints={totalPoints}
              completionDate={completionDate}
            />
          </div>
        )}

        {/* Leaderboard Section */}
        {showLeaderboard && (
          <div id="leaderboard-section" className="animate-in slide-in-from-bottom duration-700">
            <Leaderboard
              currentUserName={userName}
              currentUserPoints={totalPoints}
            />
          </div>
        )}
      </main>

      <Footer />
      <AICultureAssistant />

      <StageCompleteModal
        isOpen={modal.isOpen}
        stageTitle={modal.stageTitle}
        pointsEarned={modal.pointsEarned}
        nextMissionTitle={modal.nextMissionTitle}
        nextMissionDesc={modal.nextMissionDesc}
        onNext={proceedToNextStage}
      />

      <FinalCompleteModal
        isOpen={showFinalModal}
        userName={userName}
        totalPoints={totalPoints}
        completionTime={completionTime}
        onProceedToGuestbook={handleProceedToGuestbook}
      />
    </div>
  );
};

export default App;
