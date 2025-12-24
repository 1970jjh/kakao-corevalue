import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { addGuestbookEntry, subscribeToGuestbook, subscribeToLeaderboard, GuestbookEntry, LeaderboardEntry } from '../services/firebase';

interface FinalCompleteModalProps {
  isOpen: boolean;
  userName: string;
  userPhoto: string | null;
  totalPoints: number;
  completionTime: string;
  completionDate: string;
}

const FinalCompleteModal: React.FC<FinalCompleteModalProps> = ({
  isOpen,
  userName,
  userPhoto,
  totalPoints,
  completionTime,
  completionDate
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showGuestbookInput, setShowGuestbookInput] = useState(false);
  const [rating, setRating] = useState(8);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (isOpen) {
      const unsubGuestbook = subscribeToGuestbook((entries) => setGuestbookEntries(entries));
      const unsubLeaderboard = subscribeToLeaderboard((entries) => setLeaderboardEntries(entries.slice(0, 20)));
      return () => {
        unsubGuestbook();
        unsubLeaderboard();
      };
    }
  }, [isOpen]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#FEE500',
        useCORS: true
      });
      const link = document.createElement('a');
      link.download = `kakao-mission-clear-${userName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      alert('📸 스크린샷으로 저장해주세요!\n\niPhone: 전원 + 볼륨업\nAndroid: 전원 + 볼륨다운');
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
        rating,
        message: message.trim(),
        totalPoints,
        completionTime
      });
      setIsSubmitted(true);
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
      alert('등록 실패. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] bg-gradient-to-b from-kakao-brown to-black overflow-y-auto">
      <div className="min-h-screen py-10 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Mission All Clear Card - 다운로드 대상 */}
          <div
            ref={cardRef}
            className="bg-kakao-yellow rounded-[40px] p-8 mb-6 shadow-2xl"
          >
            {/* 헤더 */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-2">🏆</div>
              <h1 className="text-2xl md:text-3xl font-black text-kakao-brown">
                MISSION ALL CLEAR!
              </h1>
            </div>

            {/* 사원증 + 환영사 */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* 사원증 */}
              <div className="w-full md:w-1/2 bg-white rounded-3xl overflow-hidden border-4 border-kakao-brown shadow-xl">
                <div className="bg-kakao-brown py-3 text-center">
                  <span className="text-kakao-yellow font-black tracking-[0.2em]">KAKAO</span>
                  <p className="text-kakao-yellow/60 text-[9px] uppercase">Honorary Crew ID</p>
                </div>
                <div className="p-6 flex flex-col items-center bg-gradient-to-b from-white to-yellow-50">
                  <div className="w-24 h-24 rounded-full border-4 border-kakao-brown overflow-hidden mb-3 shadow-lg">
                    <img
                      src={userPhoto || "https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/service/a85d0594019200001.png"}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-black text-kakao-brown">{userName}</h3>
                  <span className="bg-kakao-brown text-kakao-yellow px-3 py-1 rounded-full text-[10px] font-black mt-2 mb-4">
                    명예 크루
                  </span>
                  <div className="w-full space-y-2 text-sm">
                    <div className="flex justify-between bg-kakao-yellow/20 px-3 py-2 rounded-lg">
                      <span className="text-kakao-brown/60 font-bold">Points</span>
                      <span className="font-black text-blue-600">{totalPoints.toLocaleString()} P</span>
                    </div>
                    <div className="flex justify-between bg-kakao-yellow/20 px-3 py-2 rounded-lg">
                      <span className="text-kakao-brown/60 font-bold">Time</span>
                      <span className="font-black text-kakao-brown">{completionTime}</span>
                    </div>
                    <div className="flex justify-between bg-kakao-yellow/20 px-3 py-2 rounded-lg">
                      <span className="text-kakao-brown/60 font-bold">Date</span>
                      <span className="font-black text-kakao-brown">{completionDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 환영사 */}
              <div className="w-full md:w-1/2 text-kakao-brown">
                <h2 className="text-xl font-black mb-4 border-b-2 border-kakao-brown pb-2">
                  🎉 환영합니다, {userName}님!
                </h2>
                <div className="text-sm leading-relaxed space-y-3">
                  <p>
                    카카오 핵심가치 내재화 미션을<br/>
                    <strong>성공적으로 완료</strong>하셨습니다.
                  </p>
                  <p>
                    본질에 집중하고, 함께 성장하며,<br/>
                    세상을 바꾸는 크루가 되어주세요.
                  </p>
                  <p className="text-kakao-brown/70 text-xs pt-2">
                    "기술과 사람으로 더 나은 세상을"
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-kakao-brown/20 text-xs text-kakao-brown/60">
                  핵심가치 내재화 with AI 수료
                </div>
              </div>
            </div>
          </div>

          {/* 다운로드 버튼 */}
          <button
            onClick={handleDownload}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl mb-4 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            <i className="fas fa-download"></i>
            Mission Clear 카드 다운로드
          </button>

          {/* 방명록 남기기 버튼 / 입력 영역 */}
          {!showGuestbookInput && !isSubmitted ? (
            <button
              onClick={() => setShowGuestbookInput(true)}
              className="w-full bg-kakao-brown text-kakao-yellow py-5 rounded-2xl font-black text-xl mb-8 hover:bg-black transition-all flex items-center justify-center gap-3"
            >
              <i className="fas fa-pen-fancy"></i>
              방명록 남기기
            </button>
          ) : !isSubmitted ? (
            <div className="bg-white rounded-3xl p-6 mb-8 border-4 border-kakao-brown">
              <h3 className="text-lg font-black text-kakao-brown mb-4">📝 방명록 작성</h3>

              {/* 평점 */}
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-400 mb-2">평가 점수</p>
                <div className="flex gap-1 flex-wrap">
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      className={`w-8 h-8 rounded-full font-bold text-sm transition-all ${
                        rating >= n ? 'bg-kakao-yellow text-kakao-brown' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* 메시지 입력 */}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="핵심가치 내재화 체험 후기를 남겨주세요!"
                className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none h-24 mb-4 outline-none focus:border-kakao-yellow"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setShowGuestbookInput(false)}
                  className="flex-1 bg-gray-200 text-gray-600 py-3 rounded-xl font-bold"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmitGuestbook}
                  disabled={isSubmitting}
                  className="flex-1 bg-kakao-brown text-kakao-yellow py-3 rounded-xl font-bold disabled:opacity-50"
                >
                  {isSubmitting ? '등록 중...' : 'Send'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-green-100 rounded-2xl p-6 mb-8 text-center border-2 border-green-500">
              <span className="text-4xl">✅</span>
              <p className="font-black text-green-600 mt-2">방명록이 등록되었습니다!</p>
            </div>
          )}

          {/* 크루들의 생생한 한마디 */}
          <div className="bg-white/10 rounded-3xl p-6 mb-8">
            <h3 className="text-center text-lg font-black text-kakao-yellow mb-4">
              💬 크루들의 생생한 한마디
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {guestbookEntries.length === 0 ? (
                <p className="text-center text-white/50 py-8">아직 후기가 없습니다. 첫 번째 후기를 남겨주세요!</p>
              ) : (
                guestbookEntries.map((entry) => (
                  <div key={entry.id} className="bg-white rounded-xl p-4 flex items-start gap-3">
                    <div className="w-10 h-10 bg-kakao-yellow rounded-full flex items-center justify-center text-kakao-brown font-black shrink-0">
                      {entry.userName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-kakao-brown">{entry.userName}</span>
                        <span className="bg-kakao-yellow/50 text-kakao-brown px-2 py-0.5 rounded-full text-xs font-bold">
                          {entry.rating}점
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 break-words">"{entry.message}"</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 리더보드 Top 20 */}
          <div className="bg-white rounded-3xl overflow-hidden border-4 border-kakao-brown">
            <div className="bg-kakao-brown text-kakao-yellow py-4 px-6 text-center">
              <h3 className="text-xl font-black">🏅 명예의 전당 TOP 20</h3>
            </div>

            {/* 테이블 헤더 */}
            <div className="bg-kakao-brown/10 py-3 px-4 flex items-center text-xs font-black text-kakao-brown/60 uppercase">
              <div className="w-12 text-center">순위</div>
              <div className="flex-1">이름</div>
              <div className="w-24 text-right">Points</div>
              <div className="w-24 text-right">Time</div>
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
                      className={`flex items-center py-3 px-4 ${isMe ? 'bg-kakao-yellow/20' : ''}`}
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
                      <div className="w-24 text-right font-black text-blue-600">
                        {entry.totalPoints.toLocaleString()}
                      </div>
                      <div className="w-24 text-right text-sm text-gray-400">
                        {entry.completionTime}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <p className="text-center text-white/40 text-xs mt-6 pb-10">
            핵심가치 내재화 with AI • © KAKAO Corp.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinalCompleteModal;
