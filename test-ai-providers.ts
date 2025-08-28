/**
 * AI Provider Test
 * Simple test to verify the AI provider fallback functionality
 */

import { getAvailableProviders } from './utils/aiProvider';

// Test function to check provider availability
function testProviders() {
  const providers = getAvailableProviders();
  
  console.log('🔍 Testing AI Provider Configuration:');
  console.log('=====================================');
  console.log(`Gemini Available: ${providers.gemini ? '✅' : '❌'}`);
  console.log(`OpenAI Available: ${providers.openai ? '✅' : '❌'}`);
  
  if (!providers.gemini && !providers.openai) {
    console.log('⚠️  Warning: No AI providers configured!');
    console.log('Please set either NEXT_PUBLIC_API_KEY (Gemini) or NEXT_PUBLIC_OPENAI_API_KEY (OpenAI) in .env.local');
  } else if (providers.gemini && providers.openai) {
    console.log('🎉 Both providers configured - full fallback support enabled!');
  } else if (providers.gemini) {
    console.log('ℹ️  Only Gemini configured - consider adding OpenAI for fallback support');
  } else {
    console.log('ℹ️  Only OpenAI configured - consider adding Gemini for primary provider');
  }
  
  console.log('=====================================');
}

// Export for use in development
if (typeof window !== 'undefined') {
  (window as any).testAIProviders = testProviders;
}

export { testProviders };