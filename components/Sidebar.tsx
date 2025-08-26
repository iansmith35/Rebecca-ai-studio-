
import React from 'react';
import { Icon } from './Icon';
import { Business } from '../types';

interface SidebarProps {
    businesses: Business[];
    selectedBusinessId: string;
    onSelectBusiness: (id: string) => void;
    onOpenTranscript: () => void;
}

const IntegrationLink: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <a
    href="#"
    className="flex items-center p-3 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200"
    onClick={(e) => e.preventDefault()}
  >
    {icon}
    <span className="ml-4 text-sm font-medium">{label}</span>
    <div className="ml-auto w-2 h-2 bg-green-400 rounded-full" title="Connected"></div>
  </a>
);

const BusinessLink: React.FC<{ business: Business; isSelected: boolean; onSelect: () => void; }> = ({ business, isSelected, onSelect }) => (
    <button
      onClick={onSelect}
      className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${isSelected ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
    >
      <Icon name={business.icon} className={`w-5 h-5 ${business.color}`} />
      <span className="ml-4 text-sm font-medium">{business.name}</span>
    </button>
);


export const Sidebar: React.FC<SidebarProps> = ({ businesses, selectedBusinessId, onSelectBusiness, onOpenTranscript }) => {
  // API key is now hard-coded in geminiService, so no warnings needed

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-700/50 p-6 flex-col hidden sm:flex">
      <div className="flex items-center mb-10">
        <div className="p-2 bg-indigo-600 rounded-lg">
           <Icon name="bot" className="w-6 h-6 text-white"/>
        </div>
        <h1 className="ml-3 text-lg font-bold text-white">Rebecca</h1>
      </div>

       <nav className="flex-1 space-y-8">
        <div>
            <h2 className="px-3 mb-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Businesses
            </h2>
            <div className="space-y-2">
                {businesses.map(business => (
                    <BusinessLink 
                        key={business.id}
                        business={business}
                        isSelected={business.id === selectedBusinessId}
                        onSelect={() => onSelectBusiness(business.id)}
                    />
                ))}
            </div>
        </div>

        <div>
            <h2 className="px-3 mb-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Tools
            </h2>
            <div className="space-y-2">
                <button
                  onClick={onOpenTranscript}
                  className="w-full flex items-center p-3 rounded-lg transition-colors duration-200 text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <Icon name="document-text" className="w-5 h-5" />
                  <span className="ml-4 text-sm font-medium">Transcripts</span>
                </button>
            </div>
        </div>

        <div>
            <h2 className="px-3 mb-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Integrations
            </h2>
            <div className="space-y-2">
              <IntegrationLink icon={<Icon name="gmail" className="w-5 h-5" />} label="Gmail" />
              <IntegrationLink icon={<Icon name="calendar" className="w-5 h-5" />} label="Calendar" />
              <IntegrationLink icon={<Icon name="drive" className="w-5 h-5" />} label="Drive" />
              <IntegrationLink icon={<Icon name="docs" className="w-5 h-5" />} label="Docs" />
              <IntegrationLink icon={<Icon name="sheets" className="w-5 h-5" />} label="Sheets" />
              <IntegrationLink icon={<Icon name="quickbooks" className="w-5 h-5" />} label="QuickBooks" />
              <IntegrationLink icon={<Icon name="bank" className="w-5 h-5" />} label="Banking" />
              <IntegrationLink icon={<Icon name="share" className="w-5 h-5" />} label="Social Media" />
            </div>
        </div>
      </nav>

      <div className="mt-auto">
        <div className="p-4 bg-gray-800 rounded-lg text-center">
            <p className="text-sm text-gray-300">Your Autonomous Business Empire</p>
        </div>
      </div>
    </aside>
  );
};
