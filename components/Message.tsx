import React from 'react';
import type { ChatMessage } from '../types';
import { Icon } from './Icon';

interface MessageProps {
  message: ChatMessage;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-indigo-500' : 'bg-gray-700'}`}>
        {isUser ? <Icon name="user" className="w-6 h-6 text-white"/> : <Icon name="bot" className="w-6 h-6 text-white"/>}
      </div>
      <div className={`p-4 rounded-lg max-w-lg ${isUser ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};
