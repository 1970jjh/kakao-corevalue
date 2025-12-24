
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-kakao-yellow dark:bg-kakao-brown">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="mb-6 inline-block animate-float">
          <span className="bg-white/90 dark:bg-kakao-black/50 backdrop-blur-md px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-black/5 shadow-sm text-kakao-brown dark:text-kakao-yellow">
            Internal Brand Experience
          </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-kakao-brown dark:text-white mb-8 tracking-tighter leading-tight uppercase">
          핵심가치 <br/>
          <span className="text-stroke text-white dark:text-kakao-black transition-all">내재화</span>
        </h1>
        
        <p className="text-xl md:text-2xl font-medium text-kakao-brown/90 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          기술과 사람으로 더 나은 세상을 만듭니다.<br/>
          우리는 연결의 무한한 가능성을 믿습니다.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="#intro" className="bg-kakao-brown text-white dark:bg-white dark:text-kakao-brown px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all hoverable">
            여정 시작하기
          </a>
          <button className="bg-white/40 dark:bg-white/10 text-kakao-brown dark:text-white border border-kakao-brown/20 px-10 py-4 rounded-full font-bold text-lg backdrop-blur-sm hover:bg-white/60 transition-all hoverable">
            문화 영상 보기 <i className="fas fa-play ml-2 text-xs"></i>
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-kakao-brown/30 dark:border-white/30 rounded-full flex justify-center p-2">
          <div className="w-1 h-3 bg-kakao-brown dark:bg-white rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
