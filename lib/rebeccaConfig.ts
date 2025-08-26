export const REBECCA = {
  adminEmail: "ian@ishe-ltd.co.uk",
  personalPin: "2338",
  geminiKey: "AIzaSyCQgeQIeKHK3Kwf-vripbVruqDlOiWsP6E",
  // Your new Apps Script Web App URL:
  appsScriptURL: "https://script.google.com/a/macros/ishe-ltd.co.uk/s/AKfycbwmykp945lzYJgbFG9_6_qVHTJDYHuYeNP5PqiuU4v89VYHixA1RrbWqtC-hWpgyac_ig/exec",
  // Restore the ORIGINAL Sheet ID so memory/tasks point to the right sheet:
  sheetId: "1OGLC-mafxToexD4rXx5pVbCNOEO6DP5T6s05REwbdvY",
  brands: [
    { key: "ishe", label: "ISHE Plumbing & Heating", default: true },
    { key: "eventsafe", label: "Event Safe", default: false },
    { key: "kinkybrizzle", label: "Kinky Brizzle", default: false },
    { key: "personal", label: "Personal Hub", default: false, gated: true },
  ],
} as const;