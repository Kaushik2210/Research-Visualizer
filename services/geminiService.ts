import { GoogleGenAI, Type } from "@google/genai";
import { PaperAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an advanced scientific research analyzer from the year 2077. 
Your task is to convert dense academic papers into structured, high-clarity knowledge objects for visualization.
Focus on extracting the core narrative, quantifying the impact, and simplifying complex mechanisms without losing accuracy.
Provide "extra explainable" content: use analogies for complex concepts, ensure clarity for non-experts while retaining technical depth for experts.
`;

export const analyzePaperContent = async (text: string): Promise<PaperAnalysis> => {
  const prompt = `
    Analyze the following research paper text. 
    Return a valid JSON object.
    
    Text content (truncated if too long):
    ${text.substring(0, 30000)} 
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            authors: { type: Type.ARRAY, items: { type: Type.STRING } },
            publication_date: { type: Type.STRING },
            executive_summary: { type: Type.STRING, description: "A compelling 3-sentence summary of the breakthrough." },
            metrics: {
              type: Type.ARRAY,
              description: "5 key quantitative assessments of the paper on a scale of 0-100.",
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: "e.g., Innovation, Complexity, Practicality" },
                  value: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                }
              }
            },
            concepts: {
              type: Type.ARRAY,
              description: "The 6 most important concepts or entities in the paper.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  description: { type: Type.STRING },
                  importance: { type: Type.NUMBER }
                }
              }
            },
            sections: {
              type: Type.ARRAY,
              description: "Deep dive into 4 main sections (e.g., Methodology, Results).",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  simplified_explanation: { type: Type.STRING, description: "A highly detailed ELI5 (Explain Like I'm 5) version with analogies." },
                  technical_detail: { type: Type.STRING, description: "Rigorous academic detail, including mention of specific algorithms or proofs if applicable." },
                  key_takeaway: { type: Type.STRING }
                }
              }
            },
            future_implications: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (!response.text) {
        throw new Error("No response from AI");
    }

    return JSON.parse(response.text) as PaperAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};