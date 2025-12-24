
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { marked } from 'marked';

interface InterviewSimulationProps {
  userPhoto: string | null;
  totalPointsAtStart: number;
  startTime: number | null;
  onAddPoints: (points: number) => void;
}

const CATEGORY_MAP = {
  why: '본질 탐구',
  solver: '문제 해결',
  grow: '함께 성장',
  ai: 'AI Native'
};

const InterviewSimulation: React.FC<InterviewSimulationProps> = ({ userPhoto, totalPointsAtStart, startTime, onAddPoints }) => {
  const [userName, setUserName] = useState('');
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string, scoreInfos?: any[] }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scores, setScores] = useState({ why: 0, solver: 0, grow: 0, ai: 0 });
  const [finalFeedback, setFinalFeedback] = useState<string>('');
  const [completionTimeStr, setCompletionTimeStr] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatHistory = useRef<any[]>([]);

  const TARGET_SCORE = 10;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const startInterview = () => {
    if (!userName.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    setGameState('playing');
    initializeAI();
  };

  const initializeAI = async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `
      당신은 카카오(Kakao)의 전문 면접관입니다. 상대방(사용자)의 이름은 '${userName}'입니다.
      사용자는 카카오 입사 지원자입니다.
      
      [목표]
      사용자가 다음 4가지 카카오 인재상을 갖췄는지 확인하는 질문을 던지고, 답변을 평가하세요:
      1. Why (본질 탐구) - 근본 원인을 파고드는가?
      2. Solver (문제 해결) - 끝까지 해결책을 찾아내는가?
      3. Grow Together (함께 성장) - 협력과 신뢰를 중시하는가?
      4. AI Native (AI 기술) - 업무에 AI를 적극 활용하는가?

      [평가 및 출력 규칙]
      사용자의 답변이 들어오면 반드시 평가 태그를 앞에 붙이세요.
      형식: <<<SCORE | 항목:점수 | 이유>>>
      항목 키워드: Why, Solver, Grow, AI
      점수: +4 ~ +12 (훌륭함), -1 ~ -2 (부족함), +2 (중립/보통)

      [중요] 지원자를 격려하는 분위기로 후하게 평가하세요. 답변에서 긍정적인 면을 찾아 점수를 주세요.
      대부분의 답변에서 +5 이상의 점수를 주고, 특별히 좋은 답변은 +8~+12점을 주세요.
      감점은 명백히 부적절한 답변에만 최소한으로 적용하세요.

      카카오스러운 수평적 분위기(영어 이름 사용 등)로 대화하세요. 질문은 한 번에 하나씩만 하세요.
    `;

    chatHistory.current = [{ role: "model", parts: [{ text: systemInstruction }] }];
    
    setIsLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `지원자 '${userName}'님을 반갑게 맞이하고 카카오 크루로서의 포부를 담은 간단한 자기소개를 부탁하세요.`,
        config: { systemInstruction }
      });
      const text = response.text || "환영합니다! 면접을 시작하겠습니다. 자기소개 부탁드려요.";
      setMessages([{ role: 'bot', text }]);
      chatHistory.current.push({ role: "model", parts: [{ text }] });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: { systemInstruction: chatHistory.current[0].parts[0].text }
      });

      const rawText = response.text || "";
      const parsed = parseResponse(rawText);
      
      if (parsed.hasScore) {
        updateScores(parsed.scoreData);
        setMessages(prev => [...prev, { role: 'bot', text: parsed.text, scoreInfos: parsed.scoreData }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: rawText }]);
      }

      chatHistory.current.push({ role: "user", parts: [{ text: userMsg }] });
      chatHistory.current.push({ role: "model", parts: [{ text: rawText }] });
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "통신 오류가 발생했습니다." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseResponse = (text: string) => {
    const regex = /<<<SCORE\s*\|\s*(.*?):(.*?)\s*\|\s*(.*?)>>>/gi;
    let match;
    const scoresFound: any[] = [];
    let cleanText = text;

    while ((match = regex.exec(text)) !== null) {
      const categoryRaw = match[1].trim().toLowerCase();
      const val = parseInt(match[2].trim());
      const reason = match[3].trim();
      
      let key = 'why';
      if (categoryRaw.includes('solv')) key = 'solver';
      else if (categoryRaw.includes('grow')) key = 'grow';
      else if (categoryRaw.includes('ai')) key = 'ai';
      
      scoresFound.push({ key, val, reason });
      cleanText = cleanText.replace(match[0], '');
    }
    return { hasScore: scoresFound.length > 0, scoreData: scoresFound, text: cleanText.trim() };
  };

  const updateScores = (scoreList: any[]) => {
    setScores(prev => {
      const next = { ...prev };
      scoreList.forEach(s => {
        next[s.key as keyof typeof prev] += s.val;
        onAddPoints(s.val > 0 ? s.val * 20 : 0);
      });
      return next;
    });
  };

  const checkFinish = () => {
    return scores.why >= TARGET_SCORE && scores.solver >= TARGET_SCORE && scores.grow >= TARGET_SCORE && scores.ai >= TARGET_SCORE;
  };

  const finishInterview = async () => {
    setGameState('result');
    if (startTime) {
      const diff = Date.now() - startTime;
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setCompletionTimeStr(`${hours > 0 ? hours + '시간 ' : ''}${mins}분 ${secs}초`);
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `면접이 종료되었습니다. 최종 점수(Why:${scores.why}, Solver:${scores.solver}, Grow:${scores.grow}, AI:${scores.ai})를 바탕으로 사용자가 카카오의 훌륭한 크루가 된 것을 축하하는 CEO의 짧은 환영사를 작성해 주세요. (마크다운 형식 권장)`;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setFinalFeedback(response.text || "카카오 크루가 되신 것을 진심으로 축하합니다!");
    } catch (e) {
      setFinalFeedback("축하합니다! 카카오의 새로운 크루로 임명합니다.");
    }
  };

  if (gameState === 'intro') {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] border-4 border-kakao-dark shadow-xl max-w-4xl mx-auto border-t-8 border-t-kakao-yellow">
        <div className="flex items-center gap-4 mb-6">
           <div className="w-12 h-12 bg-kakao-yellow rounded-xl flex items-center justify-center text-kakao-brown text-2xl">
              <i className="fas fa-id-badge"></i>
           </div>
           <h2 className="text-3xl font-black text-kakao-brown dark:text-white uppercase tracking-tighter">The Interview: 입사 지원</h2>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl mb-10 border-2 border-dashed border-gray-300">
           <h4 className="text-xl font-bold mb-4 text-kakao-brown dark:text-kakao-yellow">최종 관문 안내</h4>
           <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 font-medium">
             카카오의 4가지 인재상을 모두 갖췄음을 AI 면접관에게 증명하세요.<br/>
             모든 항목에서 <strong>10점 이상</strong>을 획득하면 전 미션이 클리어되며 최종 합격 사원증이 발급됩니다.
           </p>
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(CATEGORY_MAP).map(([k, v]) => (
                <div key={k} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border-2 border-kakao-yellow/20 text-center">
                   <p className="text-[10px] font-black text-gray-400 mb-1 uppercase">{k}</p>
                   <p className="text-sm font-black text-kakao-brown dark:text-white">{v}</p>
                </div>
              ))}
           </div>
        </div>
        <div className="flex flex-col gap-6">
           <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Candidate Name</label>
              <input 
                type="text" 
                placeholder="이름 또는 닉네임을 입력하세요" 
                className="w-full p-6 border-4 border-kakao-dark rounded-[30px] font-black text-xl outline-none focus:ring-4 focus:ring-kakao-yellow/50 transition-all bg-white"
                value={userName}
                onChange={e => setUserName(e.target.value)}
              />
           </div>
           <button onClick={startInterview} className="bg-kakao-brown text-kakao-yellow p-8 rounded-[35px] font-black text-2xl hover:bg-black transition-all shadow-[0_15px_30px_rgba(60,30,30,0.3)] hover:scale-[1.02] active:scale-95">
             면접 입장하기 <i className="fas fa-sign-in-alt ml-2"></i>
           </button>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[60px] border-8 border-kakao-yellow shadow-2xl max-w-5xl mx-auto text-center animate-in zoom-in duration-700">
         <div className="inline-block bg-kakao-brown text-kakao-yellow px-6 py-2 rounded-full font-black text-xs mb-4 uppercase tracking-[0.3em] animate-pulse">
            Mission All Clear
         </div>
         <h2 className="text-5xl font-black text-kakao-brown dark:text-white mb-2 leading-tight">🎉 축하합니다! 최종 합격 🎉</h2>
         <p className="text-gray-500 font-bold mb-12">당신은 카카오의 DNA를 가진 진정한 크루입니다.</p>
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* ID Card Display */}
            <div className="flex flex-col items-center">
               <div className="w-[340px] bg-kakao-yellow border-4 border-kakao-dark rounded-[40px] overflow-hidden shadow-[20px_20px_0_0_rgba(0,0,0,0.1)] transition-transform hover:scale-105 duration-500">
                  <div className="bg-kakao-dark text-kakao-yellow p-5 font-black tracking-[0.4em] text-center uppercase text-sm">Kakao Crew ID</div>
                  <div className="p-10 flex flex-col items-center">
                     <div className="w-36 h-36 rounded-full border-4 border-kakao-dark bg-white overflow-hidden mb-8 shadow-[inset_0_4px_10px_rgba(0,0,0,0.2)]">
                        <img src={userPhoto || "https://t1.kakaocdn.net/kakaofriend_ip/static/images/kakaoFriends/img_friends1.png"} alt="User" className="w-full h-full object-cover" />
                     </div>
                     <h3 className="text-4xl font-black text-kakao-brown mb-2">{userName}</h3>
                     <span className="bg-kakao-dark text-white px-5 py-1.5 rounded-full text-[10px] font-black mb-10 uppercase tracking-widest">Culture Inner Circle</span>
                     
                     <div className="w-full bg-white/40 p-5 rounded-3xl border-2 border-kakao-dark/5 text-left space-y-3">
                        {Object.entries(scores).map(([k, v]) => (
                          <div key={k} className="flex justify-between items-center text-[11px] font-black">
                             <span className="text-kakao-brown/50 uppercase">{CATEGORY_MAP[k as keyof typeof CATEGORY_MAP]}</span>
                             <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-kakao-dark/10 rounded-full overflow-hidden">
                                   <div className="h-full bg-blue-600" style={{ width: `${Math.min(v * 5, 100)}%` }}></div>
                                </div>
                                <span className="text-kakao-brown">{v} P</span>
                             </div>
                          </div>
                        ))}
                     </div>
                     <div className="mt-10 opacity-30 group cursor-pointer" onClick={() => alert("기기의 스크린샷 기능을 이용해 저장해주세요!")}>
                        <img src="https://barcode.tec-it.com/barcode.ashx?data=KAKAO-2025-MASTER&code=Code128&dpi=96" alt="barcode" className="h-10 transition-all group-hover:h-12" />
                     </div>
                  </div>
               </div>
               <p className="mt-6 text-[10px] font-bold text-gray-400">#사원증을_스크린샷으로_소장하세요</p>
            </div>

            <div className="space-y-8 text-left">
               <div className="bg-gray-50 dark:bg-gray-800 p-10 rounded-[50px] shadow-inner relative">
                  <div className="absolute -top-6 -left-4 text-6xl opacity-10">
                     <i className="fas fa-quote-left"></i>
                  </div>
                  <h4 className="font-black text-2xl text-kakao-brown dark:text-kakao-yellow mb-6">CEO의 환영사</h4>
                  <div 
                    className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg prose dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: marked.parse(finalFeedback) }}
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-800">
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Internal Points</p>
                     <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{(totalPointsAtStart).toLocaleString()} P</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-3xl border border-orange-100 dark:border-orange-800">
                     <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Clear Time Record</p>
                     <p className="text-3xl font-black text-orange-600 dark:text-orange-400">{completionTimeStr}</p>
                  </div>
               </div>

               <button 
                 onClick={() => {
                   document.getElementById('guestbook')?.scrollIntoView({ behavior: 'smooth' });
                 }} 
                 className="w-full bg-kakao-brown text-kakao-yellow py-7 rounded-[35px] font-black text-2xl shadow-xl hover:bg-black transition-all hover:scale-[1.02] active:scale-95 group"
               >
                 방명록에 기록 남기기 <i className="fas fa-arrow-right ml-2 group-hover:translate-x-3 transition-transform"></i>
               </button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[750px] bg-[#BACEE0] border-[10px] border-kakao-dark rounded-[60px] overflow-hidden shadow-2xl relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/service/70020734019900001.png')] bg-center bg-no-repeat grayscale"></div>
      
      {/* Score Header */}
      <div className="bg-white/90 backdrop-blur-md p-5 border-b-4 border-kakao-dark flex justify-between items-center z-10">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-kakao-dark overflow-hidden bg-kakao-yellow shrink-0">
               <img src={userPhoto || "https://t1.kakaocdn.net/kakaofriend_ip/static/images/kakaoFriends/img_friends1.png"} alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
               <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">Candidate</p>
               <p className="text-sm font-black text-blue-600">{userName}</p>
            </div>
         </div>
         <div className="flex gap-3 md:gap-4">
            {Object.entries(scores).map(([k, v]) => (
              <div key={k} className={`px-4 py-2.5 border-2 border-kakao-dark rounded-2xl text-sm font-black shadow-sm transition-all ${v >= TARGET_SCORE ? 'bg-green-500 text-white scale-110' : 'bg-white text-gray-400'}`}>
                 <span className="hidden md:inline mr-1.5">{CATEGORY_MAP[k as keyof typeof CATEGORY_MAP]}</span>
                 <span className="md:hidden uppercase mr-1">{k}</span>
                 {v}
              </div>
            ))}
         </div>
      </div>

      {/* Chat Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth z-10">
        <div className="text-center">
           <span className="bg-black/5 text-kakao-dark/40 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Session Started</span>
        </div>
        
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 group`}>
            {m.scoreInfos && m.scoreInfos.map((s: any, idx: number) => (
              <div key={idx} className="bg-white px-4 py-1.5 rounded-full text-[10px] font-black text-blue-600 mb-2 border-2 border-blue-100 shadow-sm animate-bounce flex items-center gap-2">
                <i className="fas fa-sparkles text-kakao-yellow"></i>
                {CATEGORY_MAP[s.key as keyof typeof CATEGORY_MAP]} 점수 획득! (+{s.val})
              </div>
            ))}
            <div className={`relative ${m.role === 'user' ? 'flex flex-row-reverse items-start gap-2' : 'flex items-start gap-2'}`}>
              <div
                className={`max-w-[85%] p-5 rounded-[25px] text-base leading-relaxed border-2 border-kakao-dark shadow-sm select-text
                  ${m.role === 'user' ? 'bg-kakao-yellow rounded-tr-none' : 'bg-white rounded-tl-none'}
                `}
                dangerouslySetInnerHTML={{ __html: marked.parse(m.text) }}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(m.text);
                  alert('복사되었습니다!');
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-kakao-brown hover:bg-gray-100 rounded-full"
                title="복사하기"
              >
                <i className="fas fa-copy text-sm"></i>
              </button>
            </div>
            <span className="text-[9px] font-bold text-gray-400 mt-2 px-2 uppercase">{m.role === 'user' ? userName : 'AI Interviewer'}</span>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-5 rounded-[25px] rounded-tl-none border-2 border-kakao-dark animate-pulse flex items-center gap-3">
               <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></div>
               </div>
               <span className="text-sm font-bold text-gray-400">면접관이 평가 중입니다...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white/90 backdrop-blur-md p-6 border-t-4 border-kakao-dark z-10">
         {checkFinish() ? (
           <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-2xl border-2 border-green-500 text-green-700 text-sm font-bold text-center">
                 축하합니다! 모든 기준 점수를 달성했습니다.
              </div>
              <button onClick={finishInterview} className="w-full bg-kakao-brown text-kakao-yellow py-6 rounded-[25px] border-4 border-kakao-dark font-black text-2xl shadow-xl animate-bounce hover:scale-105 active:scale-95 transition-all">
                🎊 최종 면접 통과! 사원증 발급받기
              </button>
           </div>
         ) : (
           <div className="flex gap-4">
              <textarea 
                className="flex-1 p-5 border-4 border-kakao-dark rounded-[25px] font-bold resize-none h-16 outline-none focus:ring-4 focus:ring-kakao-yellow/30"
                placeholder="답변을 입력하세요... (Enter로 전송)"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              />
              <button 
                onClick={sendMessage} 
                disabled={!input.trim() || isLoading}
                className={`px-8 rounded-[25px] font-black transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1
                  ${!input.trim() || isLoading ? 'bg-gray-100 text-gray-400 border-2 border-gray-200' : 'bg-kakao-dark text-white border-4 border-kakao-dark hover:bg-kakao-brown'}
                `}
              >
                <i className="fas fa-paper-plane text-xl"></i>
              </button>
           </div>
         )}
      </div>
    </div>
  );
};

export default InterviewSimulation;
