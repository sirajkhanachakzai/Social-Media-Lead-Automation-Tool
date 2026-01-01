
import { GoogleGenAI, Type } from "@google/genai";
import { LeadExtractionResult, Platform } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractLeadFromText = async (rawText: string): Promise<LeadExtractionResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Extract lead information from the following social media content: "${rawText}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Lead's full name" },
          email: { type: Type.STRING, description: "Lead's email address if available, else empty" },
          handle: { type: Type.STRING, description: "Social media handle or username" },
          platform: { 
            type: Type.STRING, 
            description: "Platform: Instagram, Facebook, or Unknown",
            enum: ["Instagram", "Facebook", "Unknown"]
          },
          interestLevel: { type: Type.INTEGER, description: "Level of interest from 1 to 10" },
          summary: { type: Type.STRING, description: "Short summary of their request/comment" }
        },
        required: ["name", "handle", "platform", "interestLevel", "summary"]
      },
    },
  });

  try {
    const result = JSON.parse(response.text);
    return result as LeadExtractionResult;
  } catch (error) {
    console.error("Failed to parse lead data:", error);
    throw new Error("Could not extract structured data from text.");
  }
};

export const generateFollowUpMessage = async (leadName: string, summary: string, platform: Platform): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Draft a professional yet friendly follow-up message for a potential lead named ${leadName} who contacted us on ${platform}. Their interest was summarized as: "${summary}". Keep it under 100 words and include a call to action.`,
    config: {
      temperature: 0.7,
    },
  });

  return response.text || "Hello! Thanks for reaching out. How can we help you today?";
};
