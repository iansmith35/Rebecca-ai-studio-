
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { LoginScreen } from './components/LoginScreen';
import { IsheDashboard } from './components/IsheDashboard';
import { KinkyBrizzleDashboard } from './components/KinkyBrizzleDashboard';
import { CEODashboard } from './components/CEODashboard';
import { ChatMessage, Business, Case } from './types';
import { getAiResponse } from './services/geminiService';
import { v4 as uuidv4 } from 'uuid';
import { kinkyBrizzleProducts, tenancyCases } from './data/mockData';
import { TenancyReportsDashboard } from './components/TenancyReportsDashboard';

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
    { id: 'kb', name: 'Kinky Brizzle', icon: 'shirt', color: 'text-pink-400' },
    { id: 'ishe-ph', name: 'ISHE Plumbing & Heating', icon: 'plumbing', color: 'text-sky-400' },
    { id: 'ishe-pc', name: 'ISHE Property Checks', icon: 'property', color: 'text-teal-400' },
    { id: 'es', name: 'Event Safe', icon: 'shield', color: 'text-rose-400' },
    { id: 'fe', name: 'FetLife Events', icon: 'users', color: 'text-purple-400' },
    { id: 'qdl', name: 'Quantum Leap Digital', icon: 'business', color: 'text-blue-400' },
    { id: 'cc', name: 'Celestial Cafe', icon: 'cafe', color: 'text-amber-400' },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [messages, setMessages] = useState<{[contextId: string]: ChatMessage[]}>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [businesses] = useState<Business[]>(initialBusinesses);
  const [activeContext, setActiveContext] = useState<string>('ceo');

  const selectedBusiness = businesses.find(b => b.id === activeContext);

  useEffect(() => {
    if (isAuthenticated) {
      speaker.loadVoices().then(() => {
        const ceoWelcomeText = "Welcome back. All systems are online. I'm ready to discuss the empire, your personal life, or anything else you need. How can I help you today?";
        const ceoWelcomeMessage: ChatMessage = {
          id: uuidv4(),
          sender: 'ai',
          text: ceoWelcomeText,
          timestamp: new Date().toISOString(),
        };
        
        const initialMessages = businesses.reduce((acc, business) => {
            const welcomeText = `Welcome. Let's talk about ${business.name}.`;
            acc[business.id] = [{
              id: uuidv4(),
              sender: 'ai',
              text: welcomeText,
              timestamp: new Date().toISOString(),
            }];
            return acc;
        }, {} as {[businessId: string]: ChatMessage[]});

        initialMessages['ceo'] = [ceoWelcomeMessage];

        setMessages(initialMessages);
        speaker.speak(ceoWelcomeText);
      });
    }
  }, [isAuthenticated, businesses]);

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim() || !activeContext) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => ({
        ...prev,
        [activeContext]: [...(prev[activeContext] || []), userMessage],
    }));
    setIsLoading(true);

    try {
      const contextName = selectedBusiness?.name || 'CEO';
      const aiResponseText = await getAiResponse(inputText, messages[activeContext] || [], contextName);
      
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => ({
        ...prev,
        [activeContext]: [...(prev[activeContext] || []), aiMessage],
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
        [activeContext]: [...(prev[activeContext] || []), errorMessage],
      }));
      speaker.speak(errorText);
    } finally {
      setIsLoading(false);
    }
  }, [messages, selectedBusiness, activeContext]);
  
  const handleSelectContext = (contextId: string) => {
    if (contextId === activeContext) return;
    setActiveContext(contextId);

    const businessName = businesses.find(b => b.id === contextId)?.name;
    let switchText: string;
    if (contextId === 'ceo') {
        switchText = "Right, let's talk strategy. I'm listening.";
    } else {
        switchText = `Okay, focusing on ${businessName}. What needs doing?`;
    }
    speaker.speak(switchText);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const renderDashboard = () => {
    if (activeContext === 'kb' && selectedBusiness) {
      return (
        <KinkyBrizzleDashboard
          key={activeContext}
          business={selectedBusiness}
          messages={messages[activeContext] || []}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          products={kinkyBrizzleProducts}
        />
      );
    }
    
    if (activeContext === 'ishe-ph' && selectedBusiness) {
        return (
            <IsheDashboard 
                key={activeContext}
                business={selectedBusiness}
                messages={messages[activeContext] || []}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
            />
        );
    }

    if (activeContext === 'ishe-pc' && selectedBusiness) {
      return (
          <TenancyReportsDashboard 
              key={activeContext}
              business={selectedBusiness}
              messages={messages[activeContext] || []}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              tenancyCase={tenancyCases[0]}
          />
      );
    }

    if (activeContext === 'ceo') {
      return (
        <CEODashboard
          key={activeContext}
          messages={messages[activeContext] || []}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      );
    }
    
    if (selectedBusiness) {
        // A generic dashboard for other businesses that don't have a custom one yet
        return (
            <IsheDashboard 
                key={activeContext}
                business={selectedBusiness}
                messages={messages[activeContext] || []}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
            />
        );
    }

    // Fallback if no context matches (should not happen in normal flow)
    return <div className="p-6">Please select a business context.</div>;
  }


  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen font-sans bg-gray-900 text-gray-100 overflow-hidden">
      <Sidebar 
        businesses={businesses}
        activeContextId={activeContext}
        onSelectContext={handleSelectContext}
      />
      <main className="flex-1 flex flex-col">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default App;
