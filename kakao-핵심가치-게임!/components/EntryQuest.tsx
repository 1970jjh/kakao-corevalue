
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

interface EntryQuestProps {
  onAddPoints: (points: number) => void;
  onPhotoUpload?: (photo: string) => void;
  onComplete: (points: number) => void;
}

const EntryQuest: React.FC<EntryQuestProps> = ({ onAddPoints, onPhotoUpload, onComplete }) => {
  const [image, setImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photo = reader.result as string;
        setImage(photo);
        if (onPhotoUpload) onPhotoUpload(photo);
        setGeneratedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePartyImage = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);

    try {
      if (typeof (window as any).aistudio !== 'undefined') {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await (window as any).aistudio.openSelectKey();
        }
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];

      const prompt = `A high-end cinematic, hyper-realistic full-body photograph of the person from the uploaded photo. They are standing in the center of a grand festive plaza in a whimsical 'Kakao World' at night, illuminated by magical glowing lights and fireworks. The person is shown from head to toe (full body). Surrounding them are life-sized, high-fidelity 3D versions of Kakao Friends characters (Ryan, Apeach, Muzi, and Neo) who are celebrating together with party poppers and joy. The style is epic cinematic photography, 8k resolution, photorealistic textures, professional lighting, and sharp focus. NOT an animation or cartoon style.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: mimeType } },
            { text: prompt },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          }
        }
      });

      let foundImage = false;
      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData) {
            setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        throw new Error("이미지 생성에 실패했습니다. 다시 시도해 주세요.");
      }

    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        if (typeof (window as any).aistudio !== 'undefined') {
          await (window as any).aistudio.openSelectKey();
        }
        setError("API 키 설정이 올바르지 않습니다. 다시 선택해 주세요.");
      } else {
        setError("이미지 생성 중 오류가 발생했습니다: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'Kakao_Party_With_Me.png';
    link.click();
    
    onAddPoints(500);
    onComplete(500);
  };

  return (
    <section className="py-24 bg-white dark:bg-gray-900 transition-colors border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-kakao-yellow font-black text-lg tracking-widest uppercase mb-4">Level 0: Entry Quest</h2>
          <h3 className="text-4xl md:text-5xl font-black text-kakao-brown dark:text-white mb-6">카카오 크루 입성 환영회!</h3>
          <p className="text-gray-500 max-w-2xl mx-auto">
            당신의 사진을 업로드하고 카카오 프렌즈와 함께하는<br/>
            세상에 단 하나뿐인 시네마틱 환영 파티 이미지를 생성하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`aspect-square rounded-[60px] border-4 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-12 overflow-hidden relative group
                ${image ? 'border-kakao-yellow bg-gray-50 dark:bg-gray-800' : 'border-gray-200 dark:border-gray-700 hover:border-kakao-yellow hover:bg-kakao-yellow/5'}
              `}
            >
              {image ? (
                <>
                  <img src={image} alt="Uploaded" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-black text-xl">사진 변경하기</p>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="text-7xl mb-6 text-gray-200 group-hover:text-kakao-yellow transition-colors">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <p className="text-xl font-black text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors">본인 사진을 업로드하세요</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            <button
              disabled={!image || loading}
              onClick={generatePartyImage}
              className={`w-full py-6 rounded-full font-black text-2xl shadow-xl transition-all flex items-center justify-center gap-3
                ${!image || loading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-kakao-brown text-kakao-yellow hover:scale-105 active:scale-95'
                }
              `}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>시네마틱 렌더링 중...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-sparkles"></i>
                  <span>환영 파티 시작하기</span>
                </>
              )}
            </button>
            
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold animate-shake">
                 <i className="fas fa-exclamation-triangle mr-2"></i>
                 {error}
              </div>
            )}
          </div>

          <div className="relative">
             <div className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-[60px] border-4 border-kakao-yellow relative overflow-hidden flex items-center justify-center shadow-2xl">
                {generatedImage ? (
                  <img 
                    src={generatedImage} 
                    alt="Generated Party" 
                    className="w-full h-full object-cover animate-in fade-in zoom-in duration-1000" 
                  />
                ) : (
                  <div className="text-center p-12">
                     {loading ? (
                        <div className="space-y-6">
                           <div className="text-6xl animate-bounce">🎬</div>
                           <h4 className="text-2xl font-black text-kakao-brown dark:text-kakao-yellow">영화 같은 장면을 촬영 중입니다!</h4>
                           <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                              <div className="bg-kakao-yellow h-full animate-[loading_3s_ease-in-out_infinite]"></div>
                           </div>
                        </div>
                     ) : (
                       <div className="opacity-20 flex flex-col items-center">
                          <i className="fas fa-film text-8xl mb-6"></i>
                          <p className="text-2xl font-black text-gray-400">Cinematic Preview</p>
                       </div>
                     )}
                  </div>
                )}
             </div>

             {generatedImage && (
               <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full px-12">
                 <button
                   onClick={handleDownload}
                   className="w-full bg-blue-600 text-white py-5 rounded-full font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 animate-in slide-in-from-bottom-5"
                 >
                   <i className="fas fa-download"></i>
                   이미지 저장하고 미션 완료
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 0%; transform: translateX(100%); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </section>
  );
};

export default EntryQuest;
