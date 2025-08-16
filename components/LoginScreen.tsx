import React from 'react';
import { Icon } from './Icon';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl text-center">
        
        <div className="flex justify-center">
            <div className="p-3 bg-indigo-600 rounded-xl">
                <Icon name="bot" className="w-8 h-8 text-white"/>
            </div>
        </div>

        <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Welcome to Your Empire</h1>
            <p className="text-gray-400">Rebecca is ready to help you manage your businesses.</p>
        </div>

        <button
          onClick={onLogin}
          className="w-full flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-800 bg-white rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        >
          <Icon name="google" className="w-5 h-5 mr-3" />
          Sign in with Google
        </button>

        <p className="text-xs text-gray-500">
            By signing in, you are granting Rebecca access to your connected Google Workspace account.
        </p>

      </div>
    </div>
  );
};