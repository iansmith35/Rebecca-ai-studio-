
import React, { useState } from 'react';
import { Business, ChatMessage, Product } from '../types';
import { Icon } from './Icon';
import { ChatWindow } from './ChatWindow';

interface KinkyBrizzleDashboardProps {
  business: Business;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  products: Product[];
}

type Tab = 'shop' | 'chat';

const TabButton: React.FC<{ iconName: string; label: string; isActive: boolean; onClick: () => void;}> = ({ iconName, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActive ? 'bg-pink-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
    >
        <Icon name={iconName} className="w-5 h-5" />
        <span>{label}</span>
    </button>
);

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden group">
        <div className="aspect-square bg-gray-700">
             <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-4">
            <h3 className="font-semibold text-white group-hover:text-pink-400 transition-colors">{product.name}</h3>
            <p className="text-gray-400">{product.price}</p>
        </div>
    </div>
);


export const KinkyBrizzleDashboard: React.FC<KinkyBrizzleDashboardProps> = ({ business, messages, isLoading, onSendMessage, products }) => {
    const [activeTab, setActiveTab] = useState<Tab>('shop');

    const renderContent = () => {
        switch(activeTab) {
            case 'shop':
                return (
                    <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                           {products.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                );
            case 'chat':
                return <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={onSendMessage} />;
            default:
                return null;
        }
    }

    return (
        <div className="flex-1 flex flex-col bg-gray-800 h-full">
            <header className="flex items-center justify-between p-4 border-b border-gray-700/50 shrink-0 bg-pink-900/20">
                <h2 className="text-lg font-semibold text-white">
                    <span className={`font-bold ${business.color}`}>{business.name}</span>
                </h2>
                <div className="flex items-center space-x-2">
                    <TabButton iconName="shirt" label="Shop" isActive={activeTab === 'shop'} onClick={() => setActiveTab('shop')} />
                    <TabButton iconName="chat" label="Chat with Kinky Bot" isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
                </div>
            </header>
            <div className="flex-1 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};
