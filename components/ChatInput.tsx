import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = true;
  recognition.lang = 'en-GB'; // UK English
  recognition.interimResults = true;
}

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
      if (isListening && recognition) {
        recognition.stop();
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  };
  
  const handleListen = () => {
    if (!recognition) {
        alert("Sorry, your browser doesn't support speech recognition.");
        return;
    }

    if (isListening) {
        recognition.stop();
    } else {
        setText('');
        recognition.start();
    }
  };

  useEffect(() => {
    if (!recognition) return;

    recognition.onstart = () => {
        setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setText(finalTranscript || interimTranscript);
      if(finalTranscript.trim() && !isLoading) {
        onSendMessage(finalTranscript.trim());
        setText('');
      }
    };
    
    recognition.onend = () => {
        setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
    };

    return () => {
        if (recognition) {
            recognition.stop();
        }
    };
  }, [onSendMessage, isLoading]);


  return (
    <form onSubmit={handleSubmit} className="flex items-center bg-gray-700 rounded-lg p-2 space-x-2">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask Rebecca to do something..."
        rows={1}
        className="flex-1 bg-transparent text-gray-100 placeholder-gray-400 focus:outline-none resize-none px-2 max-h-40"
        disabled={isLoading}
      />
       <button
        type="button"
        onClick={handleListen}
        disabled={isLoading}
        className={`p-2 rounded-md transition-colors duration-200 shrink-0 ${isListening ? 'bg-red-600 text-white animate-pulse' : 'text-gray-400 hover:bg-gray-600'}`}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        <Icon name="microphone" className="w-5 h-5"/>
      </button>
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="bg-indigo-600 text-white rounded-md p-2 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 shrink-0"
        aria-label="Send message"
      >
        <Icon name="send" className="w-5 h-5"/>
      </button>
    </form>
  );
};