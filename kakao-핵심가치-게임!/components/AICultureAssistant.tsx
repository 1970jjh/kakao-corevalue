
import React, { useState, useRef, useEffect } from 'react';
import { getCultureAdvice } from '../services/geminiService';

const AICultureAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const botResponse = await getCultureAdvice(userMsg);
    setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {/* Mascot Image above the button */}
      {!isOpen && (
        <div className="absolute -top-24 right-0 w-24 h-24 animate-float pointer-events-none">
          <img 
            src="https://t1.kakaocdn.net/kakaofriend_ip/static/images/kakaoFriends/img_friends1.png" 
            alt="Ryan Guide" 
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full bg-kakao-yellow text-kakao-brown shadow-2xl flex items-center justify-center hover:scale-110 transition-all hoverable group ${isOpen ? 'rotate-90' : ''}`}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comment-dots'} text-2xl`}></i>
        {!isOpen && (
          <span className="absolute -top-12 right-12 bg-white dark:bg-gray-800 text-kakao-brown dark:text-kakao-yellow px-4 py-2 rounded-xl text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border dark:border-gray-700">
            문화 상담사에게 물어보세요!
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-gray-900 rounded-[30px] shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-10 duration-300">
          <div className="bg-kakao-yellow p-6 flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-kakao-brown overflow-hidden">
              <img src="https://t1.kakaocdn.net/kakaofriend_ip/static/images/kakaoFriends/img_friends1.png" className="w-8 h-8 object-contain mt-1" alt="Ryan" />
            </div>
            <div>
              <h4 className="font-black text-kakao-brown">Culture Assistant</h4>
              <p className="text-[10px] font-bold text-kakao-brown/60 uppercase tracking-widest">Powered by Gemini AI</p>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 dark:bg-gray-900/50"
          >
            {messages.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-400 text-sm">카카오의 문화나 가치에 대해 궁금한 점을 물어보세요!</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button 
                    onClick={() => setInput('카카오의 핵심 가치 4가지는?')}
                    className="text-[10px] bg-white dark:bg-gray-800 border dark:border-gray-700 px-3 py-2 rounded-full hover:bg-kakao-yellow/20 transition-colors"
                  >
                    핵심 가치란?
                  </button>
                  <button 
                    onClick={() => setInput('영어 이름 사용의 장점은?')}
                    className="text-[10px] bg-white dark:bg-gray-800 border dark:border-gray-700 px-3 py-2 rounded-full hover:bg-kakao-yellow/20 transition-colors"
                  >
                    수평 문화?
                  </button>
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-kakao-yellow text-kakao-brown rounded-tr-none shadow-sm' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-tl-none shadow-md border dark:border-gray-700'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow-md flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="메시지를 입력하세요..."
                className="flex-1 bg-gray-100 dark:bg-gray-800 text-sm p-3 rounded-full outline-none focus:ring-2 focus:ring-kakao-yellow transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="w-10 h-10 rounded-full bg-kakao-yellow text-kakao-brown flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICultureAssistant;
