
import { GoogleGenAI, Type } from "@google/genai";
import { MovieInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMovieInsights = async (query: string, lang: 'en' | 'zh' = 'en'): Promise<MovieInsight | null> => {
  try {
    const languageRequest = lang === 'zh' ? "Please respond in Simplified Chinese." : "Please respond in English.";
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide details for a movie or TV show based on this query: "${query}". Return the most likely match. ${languageRequest}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            genre: { type: Type.ARRAY, items: { type: Type.STRING } },
            rating: { type: Type.STRING },
            year: { type: Type.STRING },
          },
          required: ["title", "summary", "genre", "rating", "year"],
        },
      },
    });

    return JSON.parse(response.text.trim()) as MovieInsight;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return null;
  }
};

export const getTrendingRecommendations = async (lang: 'en' | 'zh' = 'en'): Promise<string[]> => {
  try {
    const languageRequest = lang === 'zh' ? "Provide titles in Simplified Chinese if available." : "Provide titles in English.";
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `List 5 trending movies or series worldwide as of late 2024. ${languageRequest} Return just the titles as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Recommendations Error:", error);
    return lang === 'zh' ? ["死侍与金刚狼", "头脑特工队 2", "企鹅人", "幕府将军", "双城之战"] : ["Deadpool & Wolverine", "Inside Out 2", "The Penguin", "Shogun", "Arcane"];
  }
};
