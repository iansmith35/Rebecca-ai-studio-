export const REBECCA = {
  adminEmail: "ian@ishe-ltd.co.uk",
  personalPin: "2338",
  geminiKey: "AIzaSyCQgeQIeKHK3Kwf-vripbVruqDlOiWsP6E",
  // Apps Script Web App (Deploy > New Deployment > Web App > Execute as Me, Only Me)
  appsScriptURL: "https://script.google.com/macros/s/AKfycbxbJ7XQq8RU6m4wNNXz7XXB9tPngbgHhHowmtoPAvvS2xYcRzlKztwvFEllMsIFvimH8g/exec",
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
} as const;

export const BACKEND_SECRET = "rebecca-2338-secret";