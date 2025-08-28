export const REBECCA = {
  adminEmail: "ian@ishe-ltd.co.uk",
  personalPin: "2338",
  geminiKey: process.env.NEXT_PUBLIC_API_KEY || "AIzaSyCQgeQIeKHK3Kwf-vripbVruqDlOiWsP6E",
  // OpenAI API Key (for fallback AI provider)
  openaiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  // Firebase Functions Backend URL (replaces Apps Script)
  appsScriptURL: process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL || "https://us-central1-your-project-id.cloudfunctions.net/api",
  // Legacy Apps Script URL (kept as backup/reference)
  legacyAppsScriptURL: "https://script.google.com/macros/s/AKfycbxbJ7XQq8RU6m4wNNXz7XXB9tPngbgHhHowmtoPAvvS2xYcRzlKztwvFEllMsIFvimH8g/exec",
  // Voiceflow/Rebecca HQ Sheet (Memory/Tasks)
  sheetId: "1OGLC-mafxToexD4rXx5pVbCNOEO6DP5T6s05REwbdvY",

  brands: [
    { key: "ishe", label: "ISHE Plumbing & Heating", default: true },
    { key: "eventsafe", label: "Event Safe", default: false },
    { key: "kinkybrizzle", label: "Kinky Brizzle", default: false },
    { key: "personal", label: "Personal Hub", default: false, gated: true },
  ],

  // Optional: save TextMagic creds from UI (stored in localStorage on your browser)
  textmagic: { base: "https://rest.textmagic.com/api/v2" },

  // Firebase configuration (from environment variables)
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  },
} as const;

export const BACKEND_SECRET = "rebecca-2338-secret";