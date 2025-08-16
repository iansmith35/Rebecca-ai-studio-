
import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { Icon } from './Icon';
import { ChatWindow } from './ChatWindow';
import { FileManager } from './FileManager';

interface CEODashboardProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string, attachment?: File) => void;
}

type Tab = 'chat' | 'files';

export const CEODashboard: React.FC<CEODashboardProps> = ({ messages, isLoading, onSendMessage }) => {
    const [activeTab, setActiveTab] = useState<Tab>('chat');
    return (
        <div className="flex-1 flex flex-col bg-gray-800 h-full">
            <header className="flex items-center justify-between p-4 border-b border-gray-700/50 shrink-0 bg-amber-900/20">
                <h2 className="text-lg font-semibold text-white flex items-center gap-3">
                    <Icon name="crown" className="w-6 h-6 text-amber-400" />
                    <span className="font-bold text-amber-300">Empire HQ</span>
                </h2>
                 <div className="flex items-center space-x-2">
                    <button onClick={() => setActiveTab('chat')} className={`px-4 py-2 text-sm rounded-md flex items-center gap-2 ${activeTab === 'chat' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                        <Icon name="chat" className="w-5 h-5"/>Chat with CEO
                    </button>
                     <button onClick={() => setActiveTab('files')} className={`px-4 py-2 text-sm rounded-md flex items-center gap-2 ${activeTab === 'files' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                        <Icon name="folder" className="w-5 h-5"/>Files
                    </button>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'chat' ? (
                     <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={onSendMessage} />
                ) : (
                    <FileManager />
                )}
            </div>
        </div>
    );
};
