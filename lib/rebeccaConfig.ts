export const REBECCA = {
  adminEmail: "ian@ishe-ltd.co.uk",
  personalPin: "2338",
  geminiKey: "AIzaSyCQgeQIeKHK3Kwf-vripbVruqDlOiWsP6E",
  // Use the GENERIC (public) Apps Script Web App URL — no "/a/macros/...":
  appsScriptURL: "https://script.google.com/macros/s/AKfycbwmykp945lzYJgbFG9_6_qVHTJDYHuYeNP5PqiuU4v89VYHixA1RrbWqtC-hWpgyac_ig/exec",
  // Restore the original memory/tasks sheet
  sheetId: "1OGLC-mafxToexD4rXx5pVbCNOEO6DP5T6s05REwbdvY",
  brands: [
    { key: "ishe", label: "ISHE Plumbing & Heating", default: true },
    { key: "eventsafe", label: "Event Safe", default: false },
    { key: "kinkybrizzle", label: "Kinky Brizzle", default: false },
    { key: "personal", label: "Personal Hub", default: false, gated: true },
  ],
} as const;