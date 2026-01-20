import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, Conversation } from '../types';
import { useAI } from './AIContext';

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;
  sendMessage: (text: string, conversationId: string) => Promise<void>;
  createConversation: (name: string, isAI: boolean) => Promise<string>;
  loadConversations: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const { getAIResponse, aiActive } = useAI();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      console.log('Loading conversations...');
      const stored = await AsyncStorage.getItem('conversations');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('Loaded conversations from storage:', parsed.length);
        setConversations(parsed);
      } else {
        console.log('No stored conversations, loading demo data...');
        // Load demo conversations for first-time users
        const demoConversations: Conversation[] = [
          {
            id: 'demo-1',
            name: 'Sue',
            isAI: false,
            createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            updatedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            messages: [
              {
                id: 'msg-1',
                text: 'Hey! How was your day? 💕',
                userId: 'sue',
                createdAt: new Date(Date.now() - 7200000), // 2 hours ago
              },
              {
                id: 'msg-2',
                text: 'It was great! I was thinking about you all day ❤️',
                userId: 'user',
                createdAt: new Date(Date.now() - 7000000), // ~2 hours ago
              },
              {
                id: 'msg-3',
                text: 'Aww, that makes me so happy! I love you so much',
                userId: 'sue',
                createdAt: new Date(Date.now() - 6800000), // ~2 hours ago
              },
            ],
          },
          {
            id: 'demo-2',
            name: 'Owen',
            isAI: false,
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            updatedAt: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
            messages: [
              {
                id: 'msg-4',
                text: 'Good morning beautiful! ☀️',
                userId: 'owen',
                createdAt: new Date(Date.now() - 3600000), // 1 hour ago
              },
              {
                id: 'msg-5',
                text: 'Morning! Hope you have an amazing day!',
                userId: 'user',
                createdAt: new Date(Date.now() - 3300000), // ~1 hour ago
              },
            ],
          },
        ];
        console.log('Setting demo conversations:', demoConversations.length);
        setConversations(demoConversations);
        await saveConversations(demoConversations);
        console.log('Demo conversations saved');
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      // Set empty array on error so app doesn't hang
      setConversations([]);
    }
  };

  const saveConversations = async (convs: Conversation[]) => {
    try {
      await AsyncStorage.setItem('conversations', JSON.stringify(convs));
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  };

  const createConversation = async (name: string, isAI: boolean = false): Promise<string> => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      name,
      messages: [],
      isAI,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...conversations, newConversation];
    setConversations(updated);
    await saveConversations(updated);
    return newConversation.id;
  };

  const sendMessage = useCallback(async (text: string, conversationId: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text,
      userId: 'user',
      createdAt: new Date(),
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = [...conv.messages, newMessage];
        return {
          ...conv,
          messages: updatedMessages,
          updatedAt: new Date().toISOString(),
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    await saveConversations(updatedConversations);

    // Update current conversation if it's the active one
    if (currentConversation?.id === conversationId) {
      const updated = updatedConversations.find(c => c.id === conversationId);
      if (updated) setCurrentConversation(updated);
    }

    // If AI is active, generate response
    const conversation = updatedConversations.find(c => c.id === conversationId);
    if (conversation?.isAI && aiActive && getAIResponse) {
      setTimeout(async () => {
        try {
          const aiResponse = await getAIResponse(text, conversation.messages);
          const aiMessage: Message = {
            id: `msg-${Date.now()}`,
            text: aiResponse,
            userId: 'ai',
            createdAt: new Date(),
          };

          const finalUpdated = updatedConversations.map(conv => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                messages: [...conv.messages, aiMessage],
                updatedAt: new Date().toISOString(),
              };
            }
            return conv;
          });

          setConversations(finalUpdated);
          await saveConversations(finalUpdated);

          if (currentConversation?.id === conversationId) {
            const updated = finalUpdated.find(c => c.id === conversationId);
            if (updated) setCurrentConversation(updated);
          }
        } catch (error) {
          console.error('Error generating AI response:', error);
        }
      }, 1000);
    }
  }, [conversations, currentConversation, getAIResponse, aiActive]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        setCurrentConversation,
        sendMessage,
        createConversation,
        loadConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};
