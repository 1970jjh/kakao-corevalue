
import React, { useEffect, useState } from 'react';
import { subscribeToGuestbook, GuestbookEntry } from '../services/firebase';

const Voices: React.FC = () => {
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToGuestbook((entries) => {
      setGuestbookEntries(entries);
    });
    return () => unsubscribe();
  }, []);

  const staticReviews = [
    { name: "Justin", role: "Developer", text: "수평적인 문화 덕분에 연차에 상관없이 제 목소리를 낼 수 있는 곳입니다." },
    { name: "Sara", role: "Designer", text: "사용자 경험에 진심인 동료들과 함께 일하는 즐거움이 큽니다." },
    { name: "Kevin", role: "PM", text: "실패를 두려워하지 않는 문화가 혁신을 만든다고 생각해요." },
    { name: "Mina", role: "Content Specialist", text: "세상을 연결하는 가슴 뛰는 경험을 매일 하고 있습니다." },
    { name: "Lucas", role: "Data Scientist", text: "방대한 데이터를 다루며 한계를 넘어서는 도전을 합니다." },
  ];

  // 방명록 entries를 reviews 형식으로 변환
  const guestbookReviews = guestbookEntries.map(entry => ({
    name: entry.userName,
    role: `${entry.totalPoints.toLocaleString()}P`,
    text: entry.message,
    isGuestbook: true
  }));

  // 정적 리뷰와 방명록 합치기 (방명록이 앞에)
  const allReviews = [...guestbookReviews, ...staticReviews];

  return (
    <section id="guestbook" className="py-32 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h2 className="text-kakao-yellow font-black text-lg tracking-widest uppercase mb-4">Voices</h2>
        <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">크루들의 생생한 한마디</h3>
        {guestbookEntries.length > 0 && (
          <p className="mt-4 text-sm text-gray-500">
            방명록 {guestbookEntries.length}개의 후기가 등록되었습니다
          </p>
        )}
      </div>

      <div className="flex w-[200%] animate-marquee">
        {[...allReviews, ...allReviews].map((rev, idx) => (
          <div key={idx} className="w-[400px] flex-shrink-0 px-4">
            <div className={`p-8 rounded-3xl shadow-lg border h-full ${
              'isGuestbook' in rev && rev.isGuestbook
                ? 'bg-kakao-yellow/10 border-kakao-yellow/30 dark:bg-kakao-yellow/5'
                : 'bg-white dark:bg-kakao-black border-gray-100 dark:border-gray-800'
            }`}>
              <div className="flex text-kakao-yellow mb-6">
                {[1,2,3,4,5].map(s => <i key={s} className="fas fa-star mr-1"></i>)}
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 italic mb-8 leading-relaxed">
                "{rev.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-white font-black ${
                  'isGuestbook' in rev && rev.isGuestbook
                    ? 'bg-kakao-brown'
                    : 'bg-gray-200'
                }`}>
                  {'isGuestbook' in rev && rev.isGuestbook ? (
                    <span className="text-kakao-yellow">{rev.name.charAt(0)}</span>
                  ) : (
                    <img src={`https://picsum.photos/seed/${rev.name}/100/100`} alt={rev.name} />
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{rev.name}</p>
                  <p className={`text-sm ${
                    'isGuestbook' in rev && rev.isGuestbook
                      ? 'text-blue-600 font-bold'
                      : 'text-gray-500'
                  }`}>{rev.role}</p>
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
