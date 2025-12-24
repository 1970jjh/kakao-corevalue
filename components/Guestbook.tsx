import React, { useState, useEffect } from 'react';
import { addGuestbookEntry, subscribeToGuestbook, GuestbookEntry } from '../services/firebase';

interface GuestbookProps {
  userName: string;
  totalPoints: number;
  completionTime: string;
  onSubmitComplete: () => void;
}

const Guestbook: React.FC<GuestbookProps> = ({ userName, totalPoints, completionTime, onSubmitComplete }) => {
  const [rating, setRating] = useState(8);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToGuestbook((newEntries) => {
      setEntries(newEntries);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!message.trim()) {
      alert('방명록 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addGuestbookEntry({
        userName,
        rating,
        message: message.trim(),
        totalPoints,
        completionTime
      });
      setIsSubmitted(true);
      onSubmitComplete();
    } catch (error) {
      console.error('Error submitting guestbook:', error);
      alert('방명록 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="py-20 bg-gradient-to-b from-kakao-yellow/20 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="bg-kakao-yellow text-kakao-brown px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            Guestbook
          </span>
          <h2 className="text-4xl font-black text-kakao-brown dark:text-white mt-4 mb-2">방명록</h2>
          <p className="text-gray-500 dark:text-gray-400">핵심가치 내재화 with AI 체험 후기를 남겨주세요!</p>
        </div>

        {!isSubmitted ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] border-4 border-kakao-brown shadow-xl max-w-2xl mx-auto mb-12">
            <div className="mb-8">
              <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
                평가 점수 (1~10점)
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setRating(num)}
                    className={`w-10 h-10 rounded-full font-black text-lg transition-all ${
                      rating >= num
                        ? 'bg-kakao-yellow text-kakao-brown scale-110'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-center mt-3 text-2xl font-black text-kakao-brown dark:text-kakao-yellow">
                {rating}점
              </p>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
                후기 작성
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="핵심가치 내재화 체험은 어떠셨나요? 솔직한 후기를 남겨주세요!"
                className="w-full p-5 border-4 border-kakao-brown/20 rounded-2xl font-bold resize-none h-32 outline-none focus:border-kakao-yellow transition-colors"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-kakao-brown text-kakao-yellow py-5 rounded-full font-black text-xl hover:bg-black transition-all disabled:opacity-50"
            >
              {isSubmitting ? '등록 중...' : '방명록 등록하기'}
            </button>
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-[40px] border-4 border-green-500 max-w-2xl mx-auto mb-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-black text-green-600 dark:text-green-400 mb-2">방명록이 등록되었습니다!</h3>
            <p className="text-gray-600 dark:text-gray-400">소중한 후기 감사합니다.</p>
          </div>
        )}

        {/* 실시간 방명록 흐르는 영역 */}
        <div className="relative overflow-hidden py-8">
          <h3 className="text-center text-lg font-black text-gray-400 uppercase tracking-widest mb-6">
            실시간 후기
          </h3>
          <div className="relative h-32 overflow-hidden">
            <div className="absolute whitespace-nowrap animate-marquee-slow flex gap-8">
              {[...entries, ...entries].map((entry, idx) => (
                <div
                  key={`${entry.id}-${idx}`}
                  className="inline-flex items-center gap-4 bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl border-2 border-kakao-yellow/30 shadow-lg"
                >
                  <div className="w-12 h-12 bg-kakao-yellow rounded-full flex items-center justify-center text-kakao-brown font-black text-xl">
                    {entry.userName.charAt(0)}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-kakao-brown dark:text-white">{entry.userName}</span>
                      <span className="bg-kakao-yellow/50 text-kakao-brown px-2 py-0.5 rounded-full text-xs font-black">
                        {entry.rating}점
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      "{entry.message}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slow {
          animation: marquee-slow 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Guestbook;
