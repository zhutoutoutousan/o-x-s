import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AIService } from '../services/AIService';
import { Message } from '../types';

interface AIContextType {
  aiEnabled: boolean;
  aiActive: boolean;
  aiPersonality: any;
  learningProgress: number;
  toggleAI: () => void;
  trainAI: (messages: Message[]) => Promise<void>;
  getAIResponse: (message: string, conversationHistory: Message[]) => Promise<string>;
  activateAIMode: () => void;
  deactivateAIMode: () => void;
  startActiveMessaging: () => void;
  stopActiveMessaging: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiActive, setAiActive] = useState(false);
  const [aiPersonality, setAiPersonality] = useState<any>(null);
  const [learningProgress, setLearningProgress] = useState(0);
  const [activeMessagingInterval, setActiveMessagingInterval] = useState<NodeJS.Timeout | null>(null);
  const aiService = new AIService();

  useEffect(() => {
    loadAISettings();
  }, []);

  const loadAISettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem('aiEnabled');
      const active = await AsyncStorage.getItem('aiActive');
      const personality = await AsyncStorage.getItem('aiPersonality');
      
      if (enabled === 'true') setAiEnabled(true);
      if (active === 'true') setAiActive(true);
      if (personality) setAiPersonality(JSON.parse(personality));
    } catch (error) {
      console.error('Error loading AI settings:', error);
    }
  };

  const toggleAI = async () => {
    const newValue = !aiEnabled;
    setAiEnabled(newValue);
    await AsyncStorage.setItem('aiEnabled', String(newValue));
  };

  const trainAI = useCallback(async (messages: Message[]) => {
    try {
      setLearningProgress(0);
      const personality = await aiService.trainFromMessages(messages, (progress) => {
        setLearningProgress(progress);
      });
      setAiPersonality(personality);
      await AsyncStorage.setItem('aiPersonality', JSON.stringify(personality));
      setLearningProgress(100);
    } catch (error) {
      console.error('Error training AI:', error);
    }
  }, []);

  const getAIResponse = useCallback(async (message: string, conversationHistory: Message[]): Promise<string> => {
    if (!aiEnabled || !aiPersonality) {
      return "AI is not ready yet. Please train the AI first.";
    }
    return await aiService.generateResponse(message, conversationHistory, aiPersonality);
  }, [aiEnabled, aiPersonality]);

  const activateAIMode = async () => {
    setAiActive(true);
    await AsyncStorage.setItem('aiActive', 'true');
  };

  const deactivateAIMode = async () => {
    setAiActive(false);
    await AsyncStorage.setItem('aiActive', 'false');
    stopActiveMessaging();
  };

  const startActiveMessaging = () => {
    if (activeMessagingInterval) return;
    
    const interval = setInterval(async () => {
      if (aiActive && aiPersonality) {
        const message = await aiService.generateActiveMessage(aiPersonality);
        // This would trigger a message in the chat
        // Implementation depends on your chat system
      }
    }, 3600000); // Every hour
    
    setActiveMessagingInterval(interval);
  };

  const stopActiveMessaging = () => {
    if (activeMessagingInterval) {
      clearInterval(activeMessagingInterval);
      setActiveMessagingInterval(null);
    }
  };

  return (
    <AIContext.Provider
      value={{
        aiEnabled,
        aiActive,
        aiPersonality,
        learningProgress,
        toggleAI,
        trainAI,
        getAIResponse,
        activateAIMode,
        deactivateAIMode,
        startActiveMessaging,
        stopActiveMessaging,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within AIProvider');
  }
  return context;
};
