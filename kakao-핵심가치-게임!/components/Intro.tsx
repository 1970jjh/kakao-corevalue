
import React from 'react';

const Intro: React.FC = () => {
  return (
    <section id="intro" className="py-32 bg-white dark:bg-kakao-black relative overflow-hidden">
      {/* Decorative Character: Ryan sitting on edge */}
      <img 
        src="https://mblogthumb-phinf.pstatic.net/MjAyNTAyMjdfMzgg/MDAxNzQwNjUxMTYxNjUx.DwwOMpvR0fQyKjsF8CuRcOmOIMQJU_z3lvQ8uE9FqLkg.oerRcQUe3q8bFYLyjHwj7ZdNYktIaj1sVZ27s1oTJRIg.PNG/1739778769788.png?type=w400" 
        className="absolute -top-10 -left-20 w-80 h-auto opacity-10 pointer-events-none" 
        alt="Decorative"
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-kakao-yellow font-black text-lg tracking-widest uppercase mb-4">Who We Are</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            기술로 일상을 바꾸는<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-kakao-brown to-kakao-yellow dark:from-kakao-yellow dark:to-white">라이프스타일 플랫폼</span>
          </h3>
          <div className="w-24 h-1.5 bg-kakao-yellow mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative group">
            <div className="absolute -inset-4 bg-kakao-yellow rounded-3xl opacity-20 blur-lg group-hover:opacity-30 transition-opacity"></div>
            <img 
              src="https://shinsegae-prd-data.s3.ap-northeast-2.amazonaws.com/wp-content/uploads/2025/08/design-united-kakaoix-fashion-niniz.png" 
              alt="Kakao Friends Lifestyle" 
              className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover bg-kakao-yellow/10" 
            />
            
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border-l-8 border-kakao-yellow hidden md:block animate-float">
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Monthly Active Users</p>
              <p className="text-4xl font-black text-kakao-brown dark:text-white">5,000만+</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">세상의 모든 연결을 새롭게</h4>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                카카오는 사람과 사람, 기술과 사람을 연결하여 새로운 가치를 창출합니다. 
                국민 메신저 카카오톡을 시작으로 커머스, 콘텐츠, 금융, 모빌리티 등 일상 전반을 아우르는 생태계를 구축하고 있습니다.
              </p>
            </div>
            
            <div className="pl-6 border-l-4 border-kakao-yellow relative">
              <p className="text-gray-600 dark:text-gray-300 italic text-lg leading-relaxed">
                "단순한 편리함을 넘어, 기술이 사람을 향할 때 비로소 더 나은 세상이 만들어진다고 믿습니다."
              </p>
              <img 
                src="https://i.namu.wiki/i/h5gTVbR7kDn-bBshoThHnt42y68U48Jiln6DIpK-TwDXLrk6G_bu7l6egvkD_iNYPBkGbY028XxO2CYjHJ0oMA.webp" 
                className="absolute -right-12 -bottom-10 w-24 h-24 hidden lg:block opacity-40 group-hover:opacity-100 transition-opacity" 
                alt="Tube"
              />
            </div>

            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Beyond Mobile, Into AI</h4>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                변화하는 시대에 발맞추어 AI 기술을 서비스 전반에 녹여내고 있습니다. 
                더 스마트하고 더 개인화된 연결을 통해 라이프스타일의 진화를 꿈꿉니다.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: '함께하는 크루', value: '10,000+', icon: 'fa-users' },
            { label: '글로벌 진출', value: 'Global', icon: 'fa-globe' },
            { label: '브랜드 파워', value: 'No.1', icon: 'fa-rocket' },
            { label: '상생 경영', value: 'ESG', icon: 'fa-heart' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-kakao-yellow/10 transition-colors group hoverable cursor-default">
              <i className={`fas ${stat.icon} text-3xl text-kakao-yellow mb-4 group-hover:scale-110 transition-transform`}></i>
              <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Intro;
