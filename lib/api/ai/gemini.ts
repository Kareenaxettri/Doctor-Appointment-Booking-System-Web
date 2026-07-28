import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const aiApiClient = axios.create({
  baseURL: "https://generativelanguage.googleapis.com",
  headers: {
    "Content-Type": "application/json",
    "X-goog-api-key": API_KEY,
  },
});

export interface GeminiOptions {
  responseMimeType?: "text/plain" | "application/json";
}

export const generateContent = async (
  systemInstruction: string,
  userContext: string,
  userQuery: string,
  options: GeminiOptions = {},
  retries = 2
): Promise<any> => {
  try {
    const response = await aiApiClient.post("/v1beta/models/gemini-2.5-flash-lite:generateContent", {
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [
        {
          parts: [{ text: userContext }, { text: userQuery }],
        },
      ],
      ...(options.responseMimeType
        ? { generationConfig: { responseMimeType: options.responseMimeType } }
        : {}),
    });
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 503 && retries > 0) {
      await new Promise((r) => setTimeout(r, 1000));
      return generateContent(systemInstruction, userContext, userQuery, options, retries - 1);
    }
    console.error("Error generating content:", error);
    throw error;
  }
};