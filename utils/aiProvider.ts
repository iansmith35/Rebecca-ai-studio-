/**
 * AI Provider with Fallback Logic
 * Supports Gemini (primary) and OpenAI (fallback) providers
 */

import { REBECCA } from '@/lib/rebeccaConfig';
import OpenAI from 'openai';

const SYSTEM_RULES = [
  "British English.",
  "Never narrate emoji names (e.g., 'weeping emoji'). If you use emojis, insert the actual symbol only and keep it subtle.",
  "Be concise and practical.",
].join(" ");

// Initialize OpenAI client if API key is available
const openai = process.env.NEXT_PUBLIC_OPENAI_API_KEY && process.env.NEXT_PUBLIC_OPENAI_API_KEY !== 'your-openai-api-key-here'
  ? new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // Required for client-side usage
    })
  : null;

/**
 * Call Gemini API (primary provider)
 */
async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${REBECCA.geminiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { role: 'system', parts: [{ text: SYSTEM_RULES }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    })
  });

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
  }

  const j = await res.json();
  const response = (j?.candidates?.[0]?.content?.parts?.[0]?.text || "").toString();
  
  if (!response) {
    throw new Error('Empty response from Gemini API');
  }
  
  return response;
}

/**
 * Call OpenAI API (fallback provider)
 */
async function callOpenAI(prompt: string): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: SYSTEM_RULES },
      { role: "user", content: prompt }
    ],
    max_tokens: 1000,
    temperature: 0.7
  });

  const response = completion.choices[0]?.message?.content;
  
  if (!response) {
    throw new Error('Empty response from OpenAI API');
  }
  
  return response;
}

/**
 * Clean emoji narrations from AI response
 */
function cleanEmojis(reply: string): string {
  return reply
    .replace(/\*[^*]*emoji[^*]*\*/gi, "")     // remove *weeping emoji*
    .replace(/\b[a-z ]*emoji\b/gi, "")        // remove bare words like 'weeping emoji'
    .replace(/\s{2,}/g, " ").trim();
}

/**
 * Get AI response with fallback logic
 * Tries Gemini first, falls back to OpenAI if primary fails
 */
export async function getAIResponse(prompt: string): Promise<string> {
  let response: string;
  let primaryError: Error | null = null;
  
  // Try primary provider (Gemini) first
  try {
    response = await callGemini(prompt);
    console.log('✅ AI response from Gemini (primary provider)');
  } catch (error) {
    primaryError = error as Error;
    console.warn('⚠️ Gemini API failed:', error);
    
    // Try fallback provider (OpenAI)
    try {
      response = await callOpenAI(prompt);
      console.log('✅ AI response from OpenAI (fallback provider)');
    } catch (fallbackError) {
      console.error('❌ Both AI providers failed');
      console.error('Primary (Gemini):', primaryError);
      console.error('Fallback (OpenAI):', fallbackError);
      
      // Return a helpful error message
      throw new Error('AI services are currently unavailable. Please try again later.');
    }
  }
  
  // Clean and return response
  return cleanEmojis(response);
}

/**
 * Check which AI providers are available
 */
export function getAvailableProviders(): { gemini: boolean; openai: boolean } {
  return {
    gemini: !!(REBECCA.geminiKey && REBECCA.geminiKey !== 'AIzaSyCQgeQIeKHK3Kwf-vripbVruqDlOiWsP6E'),
    openai: !!(process.env.NEXT_PUBLIC_OPENAI_API_KEY && process.env.NEXT_PUBLIC_OPENAI_API_KEY !== 'your-openai-api-key-here')
  };
}