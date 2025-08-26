
/* Hard-coded Gemini service for browser usage (private build) */
const GEMINI_KEY = "AIzaSyCQgeQIeKHK3Kwf-vripbVruqDlOiWsP6E";
const MODEL = "gemini-1.5-pro-latest";
const API = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_KEY}`;

export async function generateText(prompt: string): Promise<string> {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }]}],
    }),
  });
  const json = await res.json();
  if (json?.candidates?.[0]?.content?.parts?.[0]?.text) {
    return json.candidates[0].content.parts[0].text as string;
  }
  return "";
}

// Alias for existing imports that might use generateContent
export async function generateContent(prompt: string): Promise<string> {
  return generateText(prompt);
}

// Compatibility function for existing App.tsx usage
export async function getAiResponse(prompt: string, history?: any[], businessContext?: string): Promise<string> {
  return generateText(prompt);
}

export default { generateText, generateContent };
