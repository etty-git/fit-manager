import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateWorkout(userProfile) {
  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `אתה מאמן כושר. בנה תוכנית אימון עבור: ${userProfile}
החזר JSON בלבד:
{ "workout_name": "string", "exercises": [{"name": "string", "sets": number, "reps": number, "rest_seconds": number}] }`,
  });

  return JSON.parse(result.text);
}