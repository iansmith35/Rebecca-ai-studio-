
import React from 'react';
import { ChatMessage } from '../types';
import { Icon } from './Icon';
import { ChatWindow } from './ChatWindow';

interface CEODashboardProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

export const CEODashboard: React.FC<CEODashboardProps> = ({ messages, isLoading, onSendMessage }) => {
    return (
        <div className="flex-1 flex flex-col bg-gray-800 h-full">
            <header className="flex items-center justify-between p-4 border-b border-gray-700/50 shrink-0 bg-amber-900/20">
                <h2 className="text-lg font-semibold text-white flex items-center gap-3">
                    <Icon name="crown" className="w-6 h-6 text-amber-400" />
                    <span className="font-bold text-amber-300">Empire HQ</span>
                </h2>
                <div className="text-sm text-gray-400">Your Private Command Center</div>
            </header>
            <div className="flex-1 overflow-y-auto">
                <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={onSendMessage} />
            </div>
        </div>
    );
};
