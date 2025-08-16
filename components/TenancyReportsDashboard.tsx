
import React, { useState } from 'react';
import { Business, ChatMessage, Case, Comparison, Responsibility, Action } from '../types';
import { Icon } from './Icon';
import { ChatWindow } from './ChatWindow';

interface TenancyReportsDashboardProps {
  business: Business;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  tenancyCase: Case;
}

const responsibilityColors: { [key in Responsibility]: string } = {
    'Tenant': 'border-rose-500 bg-rose-900/50 text-rose-300',
    'Landlord': 'border-sky-500 bg-sky-900/50 text-sky-300',
    'Wear & Tear': 'border-amber-500 bg-amber-900/50 text-amber-300',
    'Not Set': 'border-gray-600 bg-gray-800/50 text-gray-400',
};

const actionIcons: { [key in Action]: string } = {
    'Clean': 'sparkles',
    'Repair': 'hammer',
    'Replace': 'property',
    'None': 'check',
};

const ComparisonCard: React.FC<{ item: Comparison }> = ({ item }) => (
    <div className={`p-4 rounded-lg border ${responsibilityColors[item.analyst.responsibility]}`}>
        <h3 className="font-bold text-white mb-2">{item.area} - {item.item}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <img src={item.checkIn.imageUrl} alt="Check-in" className="rounded aspect-video object-cover"/>
                <p className="text-xs text-gray-400 mt-1 italic"><strong>Check-in:</strong> {item.checkIn.description}</p>
            </div>
            <div>
                <img src={item.checkOut.imageUrl} alt="Check-out" className="rounded aspect-video object-cover"/>
                 <p className="text-xs text-gray-400 mt-1 italic"><strong>Check-out:</strong> {item.checkOut.description}</p>
            </div>
        </div>
        <div className="bg-gray-900/50 p-3 rounded">
            <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <Icon name={actionIcons[item.analyst.action]} className="w-4 h-4 text-gray-300" />
                    <div>
                        <p className="text-xs text-gray-400">Action</p>
                        <p className="font-semibold text-white">{item.analyst.action}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    <Icon name="user" className="w-4 h-4 text-gray-300" />
                    <div>
                        <p className="text-xs text-gray-400">Responsibility</p>
                        <p className="font-semibold text-white">{item.analyst.responsibility}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-300">£</p>
                    <div>
                        <p className="text-xs text-gray-400">Cost</p>
                        <p className="font-semibold text-white">{item.analyst.cost.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-700/50">
                 <p className="text-xs text-gray-400 flex items-center gap-2">
                    <Icon name="scale" className="w-4 h-4" />
                    <strong>Analyst Comment:</strong>
                </p>
                 <p className="text-sm text-gray-300 mt-1">{item.analyst.legalComment}</p>
            </div>
        </div>
    </div>
);

export const TenancyReportsDashboard: React.FC<TenancyReportsDashboardProps> = ({ business, messages, isLoading, onSendMessage, tenancyCase }) => {
    const [activeTab, setActiveTab] = useState<'analysis' | 'chat'>('analysis');
    
    const totalTenantCost = tenancyCase.comparisons.reduce((sum, item) => item.analyst.responsibility === 'Tenant' ? sum + item.analyst.cost : sum, 0);

    return (
        <div className="flex-1 flex flex-col bg-gray-800 h-full">
            <header className="flex items-center justify-between p-4 border-b border-gray-700/50 shrink-0">
                <h2 className="text-lg font-semibold text-white">
                    <span className={`font-bold ${business.color}`}>{business.name}</span>
                </h2>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setActiveTab('analysis')} className={`px-4 py-2 text-sm rounded-md flex items-center gap-2 ${activeTab === 'analysis' ? 'bg-teal-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                        <Icon name="property" className="w-5 h-5"/>Analyst Workspace
                    </button>
                    <button onClick={() => setActiveTab('chat')} className={`px-4 py-2 text-sm rounded-md flex items-center gap-2 ${activeTab === 'chat' ? 'bg-teal-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                        <Icon name="chat" className="w-5 h-5"/>Chat with Analyst Bot
                    </button>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'analysis' ? (
                     <div className="grid grid-cols-12 gap-6 p-6 h-full">
                        {/* Left Column - Case Info & Nav */}
                        <div className="col-span-3 bg-gray-900/50 rounded-lg p-4 flex flex-col">
                            <h3 className="font-bold text-white mb-1">Case: {tenancyCase.id}</h3>
                            <p className="text-sm text-gray-400 mb-4">{tenancyCase.address}</p>
                            
                            <div className="space-y-2 mb-6">
                                <div className="text-xs flex justify-between"><span className="text-gray-400">Client Ref:</span><span className="font-mono text-gray-200">{tenancyCase.clientRef}</span></div>
                                <div className="text-xs flex justify-between"><span className="text-gray-400">Scheme:</span><span className="font-mono text-gray-200">{tenancyCase.depositScheme}</span></div>
                                <div className="text-xs flex justify-between"><span className="text-gray-400">Status:</span><span className="font-mono text-teal-400">{tenancyCase.status}</span></div>
                            </div>

                            <h4 className="text-sm font-semibold text-white mb-3">Item Navigator</h4>
                            <nav className="flex-1 overflow-y-auto -mr-2 pr-2">
                                <ul className="space-y-1">
                                    {tenancyCase.comparisons.map(c => (
                                        <li key={c.id}>
                                            <a href={`#${c.id}`} className="block p-2 text-sm rounded-md text-gray-400 hover:bg-gray-700 hover:text-white">{c.area}: {c.item}</a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                            
                            <div className="mt-auto pt-4 border-t border-gray-700/50">
                                <p className="text-sm text-gray-400">Total Tenant Costs</p>
                                <p className="text-3xl font-bold text-rose-400">£{totalTenantCost.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Right Column - Comparisons */}
                        <div className="col-span-9 overflow-y-auto -mr-2 pr-2">
                            <div className="space-y-6">
                               {tenancyCase.comparisons.map(item => (
                                    <div id={item.id} key={item.id}>
                                        <ComparisonCard item={item} />
                                    </div>
                               ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={onSendMessage} />
                )}
            </div>
        </div>
    );
};
