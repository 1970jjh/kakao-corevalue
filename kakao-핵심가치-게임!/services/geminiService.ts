
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are a "Kakao Culture Specialist". Your goal is to help employees internalize Kakao's culture and values.
Kakao's Core Values:
1. Integrity (사심 없는 판단과 행동): Prioritize Kakao's mission over personal gain.
2. User-Centric (사용자 중심의 관점): Everything starts from the user.
3. Challenge for Excellence (최고의 결과를 향한 집념): Don't settle, push for the best.
4. Team Synergy (공동의 목표를 위한 시너지): Work as One Team.

Kakao's Work Culture:
- Proactivity (자기주도성)
- Open & Share (공개와 공유)
- Horizontal Communication (수평 커뮤니케이션) - Using English names.

Always answer politely and professionally in Korean. If the user asks about specific values, provide examples of how to apply them.
`;

export const getCultureAdvice = async (userPrompt: string): Promise<string> => {
  // Always use the recommended initialization with named parameter and direct process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    // Access the .text property directly
    return response.text || "죄송합니다. 답변을 생성하는 중에 오류가 발생했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "API 호출 중 문제가 발생했습니다. 나중에 다시 시도해주세요.";
  }
};
