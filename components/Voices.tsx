
import React from 'react';

const Voices: React.FC = () => {
  const reviews = [
    { name: "Justin", role: "Developer", text: "수평적인 문화 덕분에 연차에 상관없이 제 목소리를 낼 수 있는 곳입니다." },
    { name: "Sara", role: "Designer", text: "사용자 경험에 진심인 동료들과 함께 일하는 즐거움이 큽니다." },
    { name: "Kevin", role: "PM", text: "실패를 두려워하지 않는 문화가 혁신을 만든다고 생각해요." },
    { name: "Mina", role: "Content Specialist", text: "세상을 연결하는 가슴 뛰는 경험을 매일 하고 있습니다." },
    { name: "Lucas", role: "Data Scientist", text: "방대한 데이터를 다루며 한계를 넘어서는 도전을 합니다." },
  ];

  return (
    <section id="guestbook" className="py-32 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h2 className="text-kakao-yellow font-black text-lg tracking-widest uppercase mb-4">Voices</h2>
        <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">크루들의 생생한 한마디</h3>
      </div>

      <div className="flex w-[200%] animate-marquee">
        {[...reviews, ...reviews].map((rev, idx) => (
          <div key={idx} className="w-[400px] flex-shrink-0 px-4">
            <div className="bg-white dark:bg-kakao-black p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 h-full">
              <div className="flex text-kakao-yellow mb-6">
                {[1,2,3,4,5].map(s => <i key={s} className="fas fa-star mr-1"></i>)}
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 italic mb-8 leading-relaxed">
                "{rev.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                   <img src={`https://picsum.photos/seed/${rev.name}/100/100`} alt={rev.name} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{rev.name}</p>
                  <p className="text-sm text-gray-500">{rev.role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Voices;
