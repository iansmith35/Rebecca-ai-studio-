
import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
  const icons: { [key: string]: React.ReactNode } = {
    bot: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    gmail: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    calendar: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    drive: (
       <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.07 7.74.02.03 6.91 11.97.02.02 7.03-12.04-6.9-11.7-7.08 11.72Z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m8.98 2.05 7.09 12.01-3.5 6.07-7.03-12.06L8.98 2.05Z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m7.23 21.98 3.53-6.09-3.57-6.14L3.6 15.9l3.63 6.08Z"/>
      </svg>
    ),
    docs: (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 3.75H6.375A2.625 2.625 0 0 0 3.75 6.375v11.25A2.625 2.625 0 0 0 6.375 20.25h11.25A2.625 2.625 0 0 0 20.25 17.625V14.25M12.75 3.75V9h5.25" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7.5 13.5h9M7.5 17.25h5.25" />
        </svg>
    ),
    sheets: (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.375 20.25h17.25a.375.375 0 0 0 .375-.375V3.375a.375.375 0 0 0-.375-.375H3.375a.375.375 0 0 0-.375.375v16.5c0 .207.168.375.375.375Z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.25 3v18M3 12h18M8.25 7.5h7.5M8.25 16.5h7.5"/>
        </svg>
    ),
    user: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    send: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    microphone: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-14 0m7 6v4m0 0H9m4 0h2M12 3a3 3 0 013 3v5a3 3 0 01-6 0V6a3 3 0 013-3z" />
      </svg>
    ),
    clipboard: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    download: (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
    ),
    check: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    business: (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7v10l8 4m0-14v14" />
        </svg>
    ),
    cafe: (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 8a4 4 0 00-4-4h-2a4 4 0 00-4 4v2a4 4 0 004 4h2a4 4 0 004-4v-2zM4 20h16v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2z" />
        </svg>
    ),
    plumbing: (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.25 4.5l-3.488 3.488a5.25 5.25 0 000 7.424l5.657 5.657a5.25 5.25 0 007.424 0l3.488-3.488M11.25 4.5a2.625 2.625 0 00-3.712 0L3 9l5.25 5.25 4.939-4.939" />
        </svg>
    ),
    property: (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M3.75 21h7.5V3.545M3.75 10.75h7.5" />
        </svg>
    ),
    shield: (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286z" />
        </svg>
    ),
    shirt: (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.4 3.75L6 7.5h12l-3.4-3.75m-5.2 0a2.25 2.25 0 013.182 0M12 21a2.25 2.25 0 002.25-2.25H9.75A2.25 2.25 0 0012 21zm-2.25-3.375h4.5a.75.75 0 00.75-.75V7.5h-6v9.375a.75.75 0 00.75.75z" />
        </svg>
    ),
    users: (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 18.72a9.094 9.094 0 00-12 0m12 0a9.094 9.094 0 00-12 0m12 0a9.094 9.094 0 00-12 0M6.06 13.04a5.996 5.996 0 0111.88 0m-11.88 0a5.996 5.996 0 0111.88 0M12 5.25a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5z" />
        </svg>
    ),
    quickbooks: (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v12m-3-6h6m3 6V6a3 3 0 00-3-3H9a3 3 0 00-3 3v12a3 3 0 003 3h6a3 3 0 003-3z" />
        </svg>
    ),
    bank: (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6m-6 4.5h6M21 21H3" />
        </svg>
    ),
    share: (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.195.025.39.05.588.08m-1.165-.333a2.25 2.25 0 11-2.186 0m2.186 0c.195.025.39.05.588.08m-1.165-.333A2.25 2.25 0 113 12.25m11.25-2.25a2.25 2.25 0 100 2.186m0-2.186c-.195.025-.39.05-.588.08m1.165.333a2.25 2.25 0 112.186 0m-2.186 0c-.195.025-.39.05-.588.08m1.165.333A2.25 2.25 0 1121 12.25m-6.835-6.835a2.25 2.25 0 10-2.186 0m2.186 0c.195-.025.39-.05.588.08m-1.165.333A2.25 2.25 0 1112.25 3m-1.165 3.333a2.25 2.25 0 100-2.186m0 2.186c.195-.025.39-.05.588.08" />
        </svg>
    ),
    google: (
        <svg className={className} viewBox="0 0 48 48" fill="none">
            <path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#34A853" d="M43.611 20.083H24v8h11.303c-1.649 4.657-6.08 8-11.303 8V36c6.627 0 12-5.373 12-12c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FBBC05" d="M11.956 29.657A12.023 12.023 0 0012 24c0-1.561-.299-3.055-.839-4.444L6.301 14.9A20.035 20.035 0 004 24c0 3.56.924 6.884 2.561 9.657l5.395-4z"/>
            <path fill="#EA4335" d="M24 36c-5.222 0-9.699-3.35-11.439-8l-5.657 5.657A20.026 20.026 0 0024 44c5.523 0 10.45-2.246 14.039-5.961L29.961 30.04A11.947 11.947 0 0124 36z"/>
        </svg>
    ),
    'briefcase': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.25 14.15v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    'calendar-days': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008zm0 4.5h.008v.008H12v-.008zm-4.5-4.5h.008v.008H7.5v-.008zm4.5 0h.008v.008H12v-.008zm-4.5 0h.008v.008H7.5v-.008zm-4.5 4.5h.008v.008H3v-.008z" />
      </svg>
    ),
    'document-text': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    'lightning-bolt': (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  };

  return icons[name] || null;
};
