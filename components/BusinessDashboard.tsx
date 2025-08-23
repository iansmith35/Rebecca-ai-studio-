
import React, { useState, ReactNode } from 'react';
import { Business, ChatMessage } from '../types';
import { Icon } from './Icon';
import { ChatWindow } from './ChatWindow';
import { JobDashboard } from './JobDashboard';
import { CalendarView } from './CalendarView';
import { ReportsView } from './ReportsView';

interface BusinessDashboardProps {
  business: Business;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  isHandsFree: boolean;
  setIsHandsFree: (value: boolean) => void;
  startListeningTrigger: number;
}

type Tab = 'chat' | 'jobs' | 'calendar' | 'reports';

const TabButton: React.FC<{ iconName: string; label: string; isActive: boolean; onClick: () => void;}> = ({ iconName, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
    >
        <Icon name={iconName} className="w-5 h-5" />
        <span>{label}</span>
    </button>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
    <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`${
            checked ? 'bg-indigo-600' : 'bg-gray-600'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
        >
            <span
            aria-hidden="true"
            className={`${
                checked ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    </div>
);


export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({ business, messages, isLoading, onSendMessage, isHandsFree, setIsHandsFree, startListeningTrigger }) => {
    const [activeTab, setActiveTab] = useState<Tab>('chat');

    const renderContent = () => {
        const chatWindow = <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={onSendMessage} startListeningTrigger={startListeningTrigger} />;
        // Only show ISHE-specific tabs for that business
        if (business.id === 'ishe-ph') {
            switch(activeTab) {
                case 'chat':
                    return chatWindow;
                case 'jobs':
                    return <JobDashboard />;
                case 'calendar':
                    return <CalendarView />;
                case 'reports':
                    return <ReportsView />;
                default:
                    return chatWindow;
            }
        }
        // For all other businesses, only show the chat window for now
        return chatWindow;
    }

    return (
        <div className="flex-1 flex flex-col bg-gray-800">
            <header className="flex items-center justify-between p-4 border-b border-gray-700/50 shrink-0">
                <h2 className="text-lg font-semibold text-white">
                    <span className={`font-bold ${business.color}`}>{business.name}</span>
                </h2>
                <div className="flex items-center space-x-4">
                    <ToggleSwitch checked={isHandsFree} onChange={setIsHandsFree} label="Hands-Free" />
                    <div className="flex items-center space-x-2">
                        {/* Only render dashboard tabs for ISHE */}
                        {business.id === 'ishe-ph' && (
                            <>
                                <TabButton iconName="chat" label="Chat" isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
                                <TabButton iconName="briefcase" label="Jobs" isActive={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} />
                                <TabButton iconName="calendar-days" label="Calendar" isActive={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
                                <TabButton iconName="document-text" label="Reports" isActive={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
                            </>
                        )}
                    </div>
                </div>
            </header>
            <div className="flex-1">
                {renderContent()}
            </div>
        </div>
    );
};
