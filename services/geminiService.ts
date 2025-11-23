import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const GeminiService = {
  /**
   * Edit an image using Gemini 2.5 Flash Image
   * @param imageBase64 The original image in base64
   * @param prompt The editing instruction (e.g., "Add a retro filter")
   */
  async editImage(imageBase64: string, prompt: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg', // Assuming JPEG/PNG, simpler to default for this demo or detect
                data: imageBase64
              }
            },
            { text: prompt }
          ]
        }
      });

      // Parse response for image
      // The model might return text if it refuses, or inlineData if it succeeds
      const candidates = response.candidates;
      if (!candidates || candidates.length === 0) throw new Error("No response from model");

      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
      
      // If we got here, maybe it returned text explaining why it failed
      const textPart = parts.find(p => p.text);
      if (textPart) {
        throw new Error(`Model returned text instead of image: ${textPart.text}`);
      }

      throw new Error("No image data found in response");
    } catch (error) {
      console.error("Gemini Image Edit Error:", error);
      throw error;
    }
  },

  /**
   * General text chat assistant
   */
  async chat(history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> {
    try {
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history,
        config: {
          systemInstruction: "You are a helpful assistant capable of analyzing complex requests.",
        }
      });
      
      const response = await chat.sendMessage({ message });
      return response.text || "I couldn't generate a text response.";
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      throw error;
    }
  }
};
