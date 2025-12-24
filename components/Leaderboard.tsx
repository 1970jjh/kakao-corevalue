import React, { useEffect, useState } from 'react';
import { subscribeToLeaderboard, LeaderboardEntry } from '../services/firebase';

interface LeaderboardProps {
  currentUserName: string;
  currentUserPoints: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUserName, currentUserPoints }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToLeaderboard((newEntries) => {
      setEntries(newEntries);
      // 현재 사용자 순위 찾기
      const rank = newEntries.findIndex(e => e.userName === currentUserName && e.totalPoints === currentUserPoints);
      setUserRank(rank >= 0 ? rank + 1 : null);
    });
    return () => unsubscribe();
  }, [currentUserName, currentUserPoints]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}`;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white';
      case 3: return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-kakao-yellow/10 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            Leaderboard
          </span>
          <h2 className="text-4xl font-black text-kakao-brown dark:text-white mt-4 mb-2">명예의 전당</h2>
          <p className="text-gray-500 dark:text-gray-400">핵심가치 내재화를 완료한 크루들의 순위입니다.</p>
        </div>

        {userRank && (
          <div className="bg-kakao-yellow/30 border-4 border-kakao-yellow p-6 rounded-3xl mb-8 text-center">
            <p className="text-sm font-bold text-kakao-brown/60 uppercase mb-2">나의 순위</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-5xl font-black text-kakao-brown">{userRank}위</span>
              <span className="text-2xl text-gray-400">/</span>
              <span className="text-xl text-gray-500">{entries.length}명 중</span>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-[30px] border-4 border-kakao-brown overflow-hidden shadow-xl">
          {/* 헤더 */}
          <div className="bg-kakao-brown text-kakao-yellow py-4 px-6 flex items-center font-black text-sm uppercase tracking-wider">
            <div className="w-16 text-center">순위</div>
            <div className="flex-1">크루</div>
            <div className="w-32 text-right">포인트</div>
            <div className="w-32 text-right hidden md:block">완료 시간</div>
          </div>

          {/* 순위 목록 */}
          <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
            {entries.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <i className="fas fa-trophy text-6xl mb-4 opacity-20"></i>
                <p className="text-lg font-bold">아직 기록이 없습니다</p>
                <p className="text-sm">첫 번째 기록을 세워보세요!</p>
              </div>
            ) : (
              entries.map((entry, idx) => {
                const rank = idx + 1;
                const isCurrentUser = entry.userName === currentUserName && entry.totalPoints === currentUserPoints;
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center py-4 px-6 transition-colors ${
                      isCurrentUser
                        ? 'bg-kakao-yellow/20 border-l-4 border-kakao-yellow'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="w-16 text-center">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-black text-lg ${getRankStyle(rank)}`}>
                        {getRankIcon(rank)}
                      </span>
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-10 h-10 bg-kakao-yellow rounded-full flex items-center justify-center text-kakao-brown font-black">
                        {entry.userName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-black text-kakao-brown dark:text-white">
                          {entry.userName}
                          {isCurrentUser && (
                            <span className="ml-2 bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-black">
                              YOU
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="w-32 text-right">
                      <span className="font-black text-blue-600 dark:text-blue-400 text-lg">
                        {entry.totalPoints.toLocaleString()}
                      </span>
                      <span className="text-gray-400 text-sm ml-1">P</span>
                    </div>
                    <div className="w-32 text-right text-sm text-gray-400 hidden md:block">
                      {entry.completionTime}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          상위 30위까지 표시됩니다 • 실시간 업데이트
        </p>
      </div>
    </section>
  );
};

export default Leaderboard;
