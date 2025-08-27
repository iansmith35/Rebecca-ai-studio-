export const REBECCA = {
  adminEmail: "ian@ishe-ltd.co.uk",
  personalPin: "2338",
  geminiKey: "AIzaSyCQgeQIeKHK3Kwf-vripbVruqDlOiWsP6E",
  appsScriptURL: "https://script.google.com/macros/s/AKfycbxbJ7XQq8RU6m4wNNXz7XXB9tPngbgHhHowmtoPAvvS2xYcRzlKztwvFEllMsIFvimH8g/exec", 
  sheetId: "1OGLC-mafxToexD4rXx5pVbCNOEO6DP5T6s05REwbdvY",
  brands: [
    { key: "ishe", label: "ISHE Plumbing & Heating", default: true },
    { key: "eventsafe", label: "Event Safe", default: false },
    { key: "kinkybrizzle", label: "Kinky Brizzle", default: false },
    { key: "personal", label: "Personal Hub", default: false, gated: true },
  ],
} as const;

export const BACKEND_SECRET = "rebecca-2338-secret";