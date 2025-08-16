
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { LoginScreen } from './components/LoginScreen';
import { BusinessDashboard } from './components/BusinessDashboard';
import { ChatMessage, Business } from './types';
import { getAiResponse } from './services/geminiService';
import { v4 as uuidv4 } from 'uuid';

// A utility to manage speech synthesis
const speaker = {
  synth: window.speechSynthesis,
  voices: [] as SpeechSynthesisVoice[],
  
  loadVoices() {
    this.voices = this.synth.getVoices();
    return new Promise(resolve => {
        if (this.voices.length) {
            resolve(this.voices);
            return;
        }
        this.synth.onvoiceschanged = () => {
            this.voices = this.synth.getVoices();
            resolve(this.voices);
        };
    });
  },

  async speak(text: string) {
    if (!this.voices.length) {
        await this.loadVoices();
    }
    // Cancel any previous speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Find a UK English female voice
    const ukVoice = this.voices.find(voice => voice.lang === 'en-GB' && voice.name.includes('Female'));
    utterance.voice = ukVoice || this.voices.find(voice => voice.lang === 'en-GB') || null;
    utterance.pitch = 1;
    utterance.rate = 1;
    this.synth.speak(utterance);
  }
};

const initialBusinesses: Business[] = [
    { id: 'ishe-ph', name: 'ISHE Plumbing & Heating', icon: 'plumbing', color: 'text-sky-400' },
    { id: 'ishe-pc', name: 'ISHE Property Checks', icon: 'property', color: 'text-teal-400' },
    { id: 'es', name: 'Event Safe', icon: 'shield', color: 'text-rose-400' },
    { id: 'kb', name: 'Kinky Brizzle', icon: 'shirt', color: 'text-pink-400' },
    { id: 'fe', name: 'FetLife Events', icon: 'users', color: 'text-purple-400' },
    { id: 'qdl', name: 'Quantum Leap Digital', icon: 'business', color: 'text-blue-400' },
    { id: 'cc', name: 'Celestial Cafe', icon: 'cafe', color: 'text-amber-400' },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [messages, setMessages] = useState<{[businessId: string]: ChatMessage[]}>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [businesses] = useState<Business[]>(initialBusinesses);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(businesses[0].id);

  const selectedBusiness = businesses.find(b => b.id === selectedBusinessId) || businesses[0];

  useEffect(() => {
    if (isAuthenticated) {
      speaker.loadVoices().then(() => {
        const welcomeText = "Welcome. I'm Rebecca, ready to help you manage your empire. Select a business to get started.";
        const welcomeMessage: ChatMessage = {
          id: uuidv4(),
          sender: 'ai',
          text: welcomeText,
          timestamp: new Date().toISOString(),
        };
        const initialMessages = businesses.reduce((acc, business) => {
            acc[business.id] = [welcomeMessage];
            return acc;
        }, {} as {[businessId: string]: ChatMessage[]});

        setMessages(initialMessages);
        speaker.speak(welcomeText);
      });
    }
  }, [isAuthenticated, businesses]);

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim() || !selectedBusinessId) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => ({
        ...prev,
        [selectedBusinessId]: [...(prev[selectedBusinessId] || []), userMessage],
    }));
    setIsLoading(true);

    try {
      const currentHistory = messages[selectedBusinessId] || [];
      const aiResponseText = await getAiResponse(inputText, currentHistory, selectedBusiness.name);
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => ({
        ...prev,
        [selectedBusinessId]: [...(prev[selectedBusinessId] || []), aiMessage],
      }));
      speaker.speak(aiResponseText);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorText = "I'm sorry, but I'm having trouble connecting to my services right now. Please try again in a moment.";
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'ai',
        text: errorText,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => ({
        ...prev,
        [selectedBusinessId]: [...(prev[selectedBusinessId] || []), errorMessage],
      }));
      speaker.speak(errorText);
    } finally {
      setIsLoading(false);
    }
  }, [messages, selectedBusiness.name, selectedBusinessId]);
  
  const handleSelectBusiness = (businessId: string) => {
    if (businessId === selectedBusinessId) return;

    setSelectedBusinessId(businessId);
    const businessName = businesses.find(b => b.id === businessId)?.name || 'your business';
    const switchMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'ai',
        text: `Right then. Let's focus on ${businessName}. What's first on the agenda?`,
        timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => {
        const currentMessages = prev[businessId] || [];
        // Only add the switch message if the history for this business is empty or doesn't already have it
        if(currentMessages.length <= 1) { 
            return { ...prev, [businessId]: [...currentMessages, switchMessage] };
        }
        return prev;
    });

    speaker.speak(switchMessage.text);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen font-sans bg-gray-900 text-gray-100 overflow-hidden">
      <Sidebar 
        businesses={businesses}
        selectedBusinessId={selectedBusinessId}
        onSelectBusiness={handleSelectBusiness}
      />
      <main className="flex-1 flex flex-col">
        <BusinessDashboard 
            key={selectedBusinessId}
            business={selectedBusiness}
            messages={messages[selectedBusinessId] || []}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
        />
      </main>
    </div>
  );
};

export default App;