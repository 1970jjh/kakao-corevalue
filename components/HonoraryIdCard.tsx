import React, { useRef } from 'react';

interface HonoraryIdCardProps {
  userName: string;
  userPhoto: string | null;
  totalPoints: number;
  completionDate: string;
}

const HonoraryIdCard: React.FC<HonoraryIdCardProps> = ({
  userName,
  userPhoto,
  totalPoints,
  completionDate
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    alert('📸 스크린샷으로 사원증을 저장해주세요!\n\niPhone: 전원 + 볼륨업\nAndroid: 전원 + 볼륨다운\nPC: Print Screen 또는 캡처 도구');
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-kakao-yellow/10 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="bg-kakao-brown text-kakao-yellow px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            Honorary Crew ID
          </span>
          <h2 className="text-4xl font-black text-kakao-brown dark:text-white mt-4 mb-2">명예 사원증 발급</h2>
          <p className="text-gray-500 dark:text-gray-400">축하합니다! 카카오 핵심가치 내재화를 완료하셨습니다.</p>
        </div>

        <div className="flex justify-center">
          <div
            ref={cardRef}
            className="relative w-[380px] bg-gradient-to-br from-kakao-yellow via-kakao-yellow to-yellow-300 rounded-[30px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.3)] border-4 border-kakao-brown"
          >
            {/* 카드 헤더 */}
            <div className="bg-kakao-brown text-center py-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 bg-kakao-yellow rounded-lg flex items-center justify-center">
                  <span className="text-kakao-brown font-black text-sm">K</span>
                </div>
                <span className="text-kakao-yellow font-black text-lg tracking-[0.3em] uppercase">KAKAO</span>
              </div>
              <p className="text-kakao-yellow/60 text-[10px] font-bold tracking-[0.2em] uppercase">Honorary Crew ID Card</p>
            </div>

            {/* 카드 본문 */}
            <div className="p-8 flex flex-col items-center">
              {/* 프로필 사진 */}
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full border-4 border-kakao-brown overflow-hidden bg-white shadow-xl">
                  <img
                    src={userPhoto || "https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/service/a85d0594019200001.png"}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <i className="fas fa-check text-white text-sm"></i>
                </div>
              </div>

              {/* 이름 */}
              <h3 className="text-3xl font-black text-kakao-brown mb-2">{userName}</h3>
              <span className="bg-kakao-brown text-kakao-yellow px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                명예 크루
              </span>

              {/* 정보 그리드 */}
              <div className="w-full bg-white/50 rounded-2xl p-5 space-y-4 backdrop-blur-sm">
                <div className="flex justify-between items-center border-b border-kakao-brown/10 pb-3">
                  <span className="text-xs font-bold text-kakao-brown/60 uppercase">Total Points</span>
                  <span className="text-xl font-black text-blue-600">{totalPoints.toLocaleString()} P</span>
                </div>
                <div className="flex justify-between items-center border-b border-kakao-brown/10 pb-3">
                  <span className="text-xs font-bold text-kakao-brown/60 uppercase">Issued Date</span>
                  <span className="text-sm font-black text-kakao-brown">{completionDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-kakao-brown/60 uppercase">Status</span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-black">VERIFIED</span>
                </div>
              </div>

              {/* 바코드 */}
              <div className="mt-6 opacity-40">
                <img
                  src={`https://barcode.tec-it.com/barcode.ashx?data=KAKAO-HONOR-${Date.now()}&code=Code128&dpi=96`}
                  alt="barcode"
                  className="h-10"
                />
              </div>
            </div>

            {/* 카드 푸터 */}
            <div className="bg-kakao-brown/10 py-3 text-center">
              <p className="text-[10px] font-bold text-kakao-brown/50">
                핵심가치 내재화 with AI 수료증
              </p>
            </div>

            {/* 홀로그램 효과 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/30 to-transparent rounded-bl-full pointer-events-none"></div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={handleDownload}
            className="bg-kakao-brown text-kakao-yellow px-8 py-4 rounded-full font-black text-lg hover:bg-black transition-all inline-flex items-center gap-2"
          >
            <i className="fas fa-camera"></i>
            사원증 저장하기
          </button>
          <p className="mt-3 text-xs text-gray-400">#명예사원증을_스크린샷으로_저장하세요</p>
        </div>
      </div>
    </section>
  );
};

export default HonoraryIdCard;
