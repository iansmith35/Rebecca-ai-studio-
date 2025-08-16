
import React, { useState } from 'react';
import { Business, ChatMessage } from '../types';
import { Icon } from './Icon';
import { ChatWindow } from './ChatWindow';
import { JobDashboard } from './JobDashboard';
import { CalendarView } from './CalendarView';
import { ReportsView } from './ReportsView';
import { FileManager } from './FileManager';

interface IsheDashboardProps {
  business: Business;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string, attachment?: File) => void;
}

type Tab = 'chat' | 'jobs' | 'calendar' | 'reports' | 'files';

const TabButton: React.FC<{ iconName: string; label: string; isActive: boolean; onClick: () => void;}> = ({ iconName, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
    >
        <Icon name={iconName} className="w-5 h-5" />
        <span>{label}</span>
    </button>
);


export const IsheDashboard: React.FC<IsheDashboardProps> = ({ business, messages, isLoading, onSendMessage }) => {
    const [activeTab, setActiveTab] = useState<Tab>('chat');

    const renderContent = () => {
        // Only show ISHE-specific tabs for that business
        if (business.id === 'ishe-ph') {
            switch(activeTab) {
                case 'chat':
                    return <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={onSendMessage} />;
                case 'jobs':
                    return <JobDashboard />;
                case 'calendar':
                    return <CalendarView />;
                case 'reports':
                    return <ReportsView />;
                case 'files':
                    return <FileManager />;
                default:
                    return <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={onSendMessage} />;
            }
        }
        // For all other businesses, handle chat and files
        switch(activeTab) {
            case 'chat':
                return <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={onSendMessage} />;
            case 'files':
                return <FileManager />;
            default:
                return <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={onSendMessage} />;
        }
    }

    return (
        <div className="flex-1 flex flex-col bg-gray-800 h-full">
            <header className="flex items-center justify-between p-4 border-b border-gray-700/50 shrink-0">
                <h2 className="text-lg font-semibold text-white">
                    <span className={`font-bold ${business.color}`}>{business.name}</span>
                </h2>
                <div className="flex items-center space-x-2">
                    {/* Render dashboard tabs based on business type */}
                    {business.id === 'ishe-ph' ? (
                        <>
                            <TabButton iconName="chat" label="Chat" isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
                            <TabButton iconName="briefcase" label="Jobs" isActive={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} />
                            <TabButton iconName="calendar-days" label="Calendar" isActive={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
                            <TabButton iconName="document-text" label="Reports" isActive={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
                            <TabButton iconName="folder" label="Files" isActive={activeTab === 'files'} onClick={() => setActiveTab('files')} />
                        </>
                    ) : (
                         <>
                            <TabButton iconName="chat" label="Chat" isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
                            <TabButton iconName="folder" label="Files" isActive={activeTab === 'files'} onClick={() => setActiveTab('files')} />
                         </>
                    )}
                </div>
            </header>
            <div className="flex-1 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};
