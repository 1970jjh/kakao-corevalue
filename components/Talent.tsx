
import React, { useState, useRef } from 'react';
import InterviewSimulation from './InterviewSimulation';

interface TalentProps {
  userPhoto: string | null;
  totalPoints: number;
  startTime: number | null;
  onAddPoints: (points: number) => void;
  onInterviewComplete: (userName: string) => void;
}

const Talent: React.FC<TalentProps> = ({ userPhoto, totalPoints, startTime, onAddPoints, onInterviewComplete }) => {
  const [showInterview, setShowInterview] = useState(false);
  const interviewRef = useRef<HTMLDivElement>(null);

  const talents = [
    { title: "본질을 묻는 사람", tag: "Why", icon: "fa-question-circle" },
    { title: "문제를 해결하는 사람", tag: "Solver", icon: "fa-tools" },
    { title: "함께 성장하는 사람", tag: "Grow Together", icon: "fa-seedling" },
    { title: "AI 혁신을 이끄는 사람", tag: "Innovator", icon: "fa-brain" }
  ];

  const handleStartInterview = () => {
    setShowInterview(true);
    setTimeout(() => {
      interviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <section id="talent-section" className="py-32 bg-white dark:bg-kakao-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 relative">
          <h2 className="text-kakao-yellow font-black text-lg tracking-widest uppercase mb-4">Ideal Talent</h2>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-8">카카오가 찾는 사람 (인재상)</h3>
          <p className="text-xl text-gray-500 mb-12">모든 미션을 완료하신 당신, 이제 카카오가 찾는 인재의 모습을 확인하세요.</p>
          <img 
            src="https://t1.kakaocdn.net/kakaofriend_ip/static/images/home/img_kakaofriends.png" 
            alt="Kakao Friends" 
            className="w-full max-w-md mx-auto mb-12 opacity-90 animate-float"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {talents.map((t) => (
            <div key={t.title} className="bg-gray-50 dark:bg-gray-800 p-10 rounded-[40px] border-t-8 border-transparent hover:border-kakao-yellow transition-all group hoverable cursor-default shadow-sm hover:shadow-2xl">
              <div className="text-5xl text-kakao-yellow mb-8 group-hover:scale-110 transition-transform">
                <i className={`fas ${t.icon}`}></i>
              </div>
              <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{t.title}</h4>
              <p className="text-kakao-yellow font-black uppercase text-sm tracking-widest">{t.tag}</p>
            </div>
          ))}
        </div>

        {/* Start Interview CTA */}
        <div className="text-center mb-24">
           <div className="bg-gray-50 dark:bg-gray-800 p-12 rounded-[50px] shadow-2xl inline-block max-w-2xl border-4 border-kakao-yellow">
              <h4 className="text-3xl font-black text-gray-900 dark:text-white mb-4">The Interview: 인재상 시뮬레이터</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                당신은 카카오의 DNA를 가지고 있나요?<br/>
                AI 면접관의 질문에 답변하고 카카오 크루 사원증을 발급받으세요.
              </p>
              <button 
                onClick={handleStartInterview}
                className="bg-kakao-brown text-kakao-yellow px-12 py-5 rounded-full font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                인재상 면접 인터뷰 시작하기
              </button>
           </div>
        </div>

        {showInterview && (
          <div ref={interviewRef} className="mt-16 animate-in slide-in-from-top-10 duration-700">
            <InterviewSimulation
               userPhoto={userPhoto}
               totalPointsAtStart={totalPoints}
               startTime={startTime}
               onAddPoints={onAddPoints}
               onInterviewComplete={onInterviewComplete}
            />
          </div>
        )}

        <div className="mt-20 p-12 bg-kakao-brown dark:bg-gray-800 rounded-[60px] text-white overflow-hidden relative shadow-2xl border-b-8 border-black/20">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div className="md:col-span-2">
              <h4 className="text-4xl font-black mb-6">핵심가치 내재화, <span className="text-kakao-yellow">Grow Everyday</span></h4>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                카카오의 모든 문화와 가치를 완벽하게 이해하셨습니다.<br/>
                이제 당신의 도전을 응원합니다. 위대한 여정에 함께하세요.
              </p>
              <a href="https://careers.kakao.com/index" target="_blank" rel="noopener noreferrer" className="inline-block bg-kakao-yellow text-kakao-brown px-12 py-5 rounded-full font-black text-xl hover:bg-white transition-all hoverable">
                채용 공고 확인하기 <i className="fas fa-external-link-alt ml-2"></i>
              </a>
            </div>
            <div className="hidden md:block opacity-20">
              <i className="fas fa-rocket text-[180px] rotate-12"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Talent;
