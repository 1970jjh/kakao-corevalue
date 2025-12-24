import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { addGuestbookEntry, subscribeToGuestbook, subscribeToLeaderboard, uploadClearCardImage, GuestbookEntry, LeaderboardEntry } from '../services/firebase';

interface FinalCompleteSectionProps {
  show: boolean;
  userName: string;
  userPhoto: string | null;
  totalPoints: number;
  completionTime: string;
  completionDate: string;
}

const FinalCompleteSection: React.FC<FinalCompleteSectionProps> = ({
  show,
  userName,
  userPhoto,
  totalPoints,
  completionTime,
  completionDate
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (show) {
      const unsubGuestbook = subscribeToGuestbook((entries) => setGuestbookEntries(entries));
      const unsubLeaderboard = subscribeToLeaderboard((entries) => setLeaderboardEntries(entries.slice(0, 20)));
      return () => {
        unsubGuestbook();
        unsubLeaderboard();
      };
    }
  }, [show]);

  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#FEE500',
        useCORS: true
      });

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
      const fileName = `${userName}+${dateStr}.JPG`;

      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      const response = await fetch(dataUrl);
      const blob = await response.blob();

      try {
        await uploadClearCardImage(blob, userName);
        console.log('Image uploaded to Firebase Storage');
      } catch (uploadError) {
        console.log('Storage upload skipped (Firebase not configured)');
      }

      setDownloadComplete(true);
    } catch (error) {
      console.error('Download error:', error);
      alert('📸 스크린샷으로 저장해주세요!\n\niPhone: 전원 + 볼륨업\nAndroid: 전원 + 볼륨다운');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmitGuestbook = async () => {
    if (!message.trim()) {
      alert('방명록 내용을 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    try {
      await addGuestbookEntry({
        userName,
        rating: 10,
        message: message.trim(),
        totalPoints,
        completionTime
      });
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
      alert('등록 실패. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <section id="final-complete" className="bg-gradient-to-b from-kakao-brown to-black py-16 px-4 scroll-mt-20">
      <div className="max-w-4xl mx-auto">

        {/* ========== 섹션 1: Mission Clear 카드 ========== */}
        <div
          ref={cardRef}
          className="bg-kakao-yellow rounded-[40px] p-8 mb-6 shadow-2xl"
        >
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🏆</div>
            <h1 className="text-2xl md:text-3xl font-black text-kakao-brown">
              MISSION ALL CLEAR!
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            {/* 사원증 */}
            <div className="w-full md:w-1/2 bg-white rounded-3xl overflow-hidden border-4 border-kakao-brown shadow-xl flex flex-col">
              <div className="bg-kakao-brown py-3 text-center">
                <span className="text-kakao-yellow font-black tracking-[0.2em]">KAKAO</span>
                <p className="text-kakao-yellow/60 text-[9px] uppercase">Honorary Crew ID</p>
              </div>
              <div className="p-6 flex flex-col items-center bg-gradient-to-b from-white to-yellow-50 flex-1">
                <div className="w-20 h-20 rounded-full border-4 border-kakao-brown overflow-hidden mb-3 shadow-lg">
                  <img
                    src={userPhoto || "https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/service/a85d0594019200001.png"}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-black text-kakao-brown">{userName}</h3>
                <span className="bg-kakao-brown text-kakao-yellow px-3 py-1 rounded-full text-[10px] font-black mt-2 mb-3">
                  명예 크루
                </span>
                <div className="w-full space-y-1.5 text-sm">
                  <div className="flex justify-between bg-kakao-yellow/20 px-3 py-1.5 rounded-lg">
                    <span className="text-kakao-brown/60 font-bold text-xs">Points</span>
                    <span className="font-black text-blue-600">{totalPoints.toLocaleString()} P</span>
                  </div>
                  <div className="flex justify-between bg-kakao-yellow/20 px-3 py-1.5 rounded-lg">
                    <span className="text-kakao-brown/60 font-bold text-xs">Time</span>
                    <span className="font-black text-kakao-brown">{completionTime}</span>
                  </div>
                  <div className="flex justify-between bg-kakao-yellow/20 px-3 py-1.5 rounded-lg">
                    <span className="text-kakao-brown/60 font-bold text-xs">Date</span>
                    <span className="font-black text-kakao-brown">{completionDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CEO 환영사 */}
            <div className="w-full md:w-1/2 bg-white/90 rounded-3xl p-6 flex flex-col justify-center">
              <h2 className="text-lg font-black text-kakao-brown mb-3">
                🎉 환영합니다, {userName}님!
              </h2>
              <p className="text-xs text-kakao-brown/70 italic">
                "기술과 사람으로 더 나은 세상을"
              </p>
            </div>
          </div>
        </div>

        {/* 다운로드 버튼 */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-full py-5 rounded-2xl font-black text-xl mb-10 transition-all flex items-center justify-center gap-3 shadow-xl ${
            downloadComplete
              ? 'bg-green-600 text-white'
              : 'bg-kakao-brown text-kakao-yellow hover:bg-black'
          } disabled:opacity-70`}
        >
          {isDownloading ? (
            <>
              <div className="w-6 h-6 border-4 border-kakao-yellow/30 border-t-kakao-yellow rounded-full animate-spin"></div>
              저장 중...
            </>
          ) : downloadComplete ? (
            <>
              <i className="fas fa-check"></i>
              다운로드 완료!
            </>
          ) : (
            <>
              <i className="fas fa-download"></i>
              Mission Clear 카드 다운로드
            </>
          )}
        </button>

        {/* ========== 섹션 2: 크루들의 생생한 한마디 ========== */}
        <div className="bg-white rounded-3xl p-6 mb-8 border-4 border-kakao-brown shadow-xl">
          <h3 className="text-xl font-black text-kakao-brown mb-4 flex items-center gap-2">
            <span className="text-2xl">💬</span> 크루들의 생생한 한마디
          </h3>

          {/* 마퀴 애니메이션 방명록 */}
          <div className="relative overflow-hidden py-4 mb-6">
            {guestbookEntries.length === 0 ? (
              <p className="text-center text-gray-400 py-8">아직 후기가 없습니다. 첫 번째 후기를 남겨주세요!</p>
            ) : (
              <div className="relative h-24 overflow-hidden">
                <div className="absolute whitespace-nowrap animate-marquee flex gap-6">
                  {[...guestbookEntries, ...guestbookEntries].map((entry, idx) => (
                    <div
                      key={`${entry.id}-${idx}`}
                      className="inline-flex items-center gap-3 bg-kakao-yellow/20 px-5 py-3 rounded-2xl border-2 border-kakao-yellow/50"
                    >
                      <div className="w-10 h-10 bg-kakao-yellow rounded-full flex items-center justify-center text-kakao-brown font-black shrink-0">
                        {entry.userName.charAt(0)}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-black text-kakao-brown text-sm">{entry.userName}</span>
                          <span className="text-xs text-gray-400">{entry.totalPoints.toLocaleString()}P</span>
                        </div>
                        <p className="text-xs text-gray-600 max-w-[200px] truncate">"{entry.message}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 방명록 입력 영역 */}
          <div className="pt-6 border-t-2 border-gray-100">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
              📝 방명록에 기록 남기기
            </h4>
            <div className="mb-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="핵심가치 내재화 체험 후기를 남겨주세요!"
                className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none h-24 outline-none focus:border-kakao-yellow text-gray-700"
              />
            </div>
            <button
              onClick={handleSubmitGuestbook}
              disabled={isSubmitting || !message.trim()}
              className="w-full bg-kakao-brown text-kakao-yellow py-4 rounded-xl font-black text-lg hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 25s linear infinite;
          }
        `}</style>

        {/* ========== 섹션 3: 리더보드 Top 20 ========== */}
        <div className="bg-white rounded-3xl overflow-hidden border-4 border-kakao-brown shadow-xl">
          <div className="bg-kakao-brown text-kakao-yellow py-4 px-6 text-center">
            <h3 className="text-xl font-black">🏅 명예의 전당 TOP 20</h3>
          </div>

          <div className="bg-kakao-brown/10 py-3 px-4 flex items-center text-xs font-black text-kakao-brown/60 uppercase">
            <div className="w-12 text-center">순위</div>
            <div className="flex-1">이름</div>
            <div className="w-28 text-right">Total Points</div>
            <div className="w-24 text-right">Clear Time</div>
          </div>

          <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
            {leaderboardEntries.length === 0 ? (
              <p className="text-center text-gray-400 py-12">아직 기록이 없습니다</p>
            ) : (
              leaderboardEntries.map((entry, idx) => {
                const rank = idx + 1;
                const isMe = entry.userName === userName;
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center py-3 px-4 ${isMe ? 'bg-kakao-yellow/30' : ''}`}
                  >
                    <div className="w-12 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-black text-sm ${
                        rank === 1 ? 'bg-yellow-400 text-white' :
                        rank === 2 ? 'bg-gray-400 text-white' :
                        rank === 3 ? 'bg-orange-400 text-white' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : rank}
                      </span>
                    </div>
                    <div className="flex-1 font-bold text-kakao-brown">
                      {entry.userName}
                      {isMe && <span className="ml-2 bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px]">YOU</span>}
                    </div>
                    <div className="w-28 text-right font-black text-blue-600">
                      {entry.totalPoints.toLocaleString()} P
                    </div>
                    <div className="w-24 text-right text-sm text-gray-500">
                      {entry.completionTime}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          핵심가치 내재화 with AI • © KAKAO Corp.
        </p>
      </div>
    </section>
  );
};

export default FinalCompleteSection;
