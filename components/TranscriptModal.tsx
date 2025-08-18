
import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { Icon } from './Icon';

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  businessName: string;
}

export const TranscriptModal: React.FC<TranscriptModalProps> = ({ isOpen, onClose, messages, businessName }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  
  if (!isOpen) return null;

  const formatTranscript = () => {
    return messages
      .map(msg => {
        const time = new Date(msg.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        const sender = msg.sender === 'ai' ? 'Rebecca' : 'User';
        return `[${time}] ${sender}: ${msg.text}`;
      })
      .join('\n');
  };

  const handleCopy = () => {
    const transcriptText = formatTranscript();
    navigator.clipboard.writeText(transcriptText).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy'), 2000);
    }, (err) => {
      console.error('Could not copy text: ', err);
      setCopyButtonText('Failed');
      setTimeout(() => setCopyButtonText('Copy'), 2000);
    });
  };

  const handleDownload = () => {
    const transcriptText = formatTranscript();
    const blob = new Blob([transcriptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeBusinessName = businessName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const date = new Date().toISOString().split('T')[0];
    link.download = `transcript_${safeBusinessName}_${date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="transcript-title"
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-700/50 shrink-0">
          <h2 id="transcript-title" className="text-lg font-semibold text-white">
            Conversation Transcript: <span className="font-bold text-indigo-400">{businessName}</span>
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 rounded-md hover:bg-gray-700 hover:text-white"
            aria-label="Close transcript"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <main className="p-6 overflow-y-auto text-sm text-gray-300 bg-gray-900/50 flex-1">
          <pre className="whitespace-pre-wrap font-mono">
            {formatTranscript()}
          </pre>
        </main>

        <footer className="flex items-center justify-end p-4 border-t border-gray-700/50 shrink-0 space-x-3">
            <button
                onClick={handleCopy}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 bg-gray-700 text-gray-200 hover:bg-gray-600"
            >
                <Icon name={copyButtonText === 'Copied!' ? 'check' : 'clipboard'} className="w-5 h-5" />
                <span>{copyButtonText}</span>
            </button>
            <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 bg-indigo-600 text-white hover:bg-indigo-500"
            >
                <Icon name="download" className="w-5 h-5" />
                <span>Download .txt</span>
            </button>
        </footer>
      </div>
    </div>
  );
};
