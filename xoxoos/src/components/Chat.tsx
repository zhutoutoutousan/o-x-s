import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Chat.css';

export interface Message {
  id: string;
  text: string;
  sender: 'user1' | 'user2';
  timestamp: Date;
  isSweet?: boolean;
}

interface ChatProps {
  user1Name?: string;
  user2Name?: string;
  messages?: Message[];
  onSendMessage?: (text: string) => void;
}

export const Chat: React.FC<ChatProps> = ({
  user1Name = 'Sue',
  user2Name = 'Owen',
  messages: initialMessages = [],
  onSendMessage
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text: input,
      sender: messages.length % 2 === 0 ? 'user1' : 'user2',
      timestamp: new Date(),
      isSweet: input.toLowerCase().includes('love') || 
               input.toLowerCase().includes('❤️') ||
               input.toLowerCase().includes('you') ||
               input.toLowerCase().includes('miss')
    };

    setMessages(prev => [...prev, newMessage]);
    onSendMessage?.(input);
    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>💕 Our Sweet Moments</h3>
        <span className="chat-subtitle">{user1Name} & {user2Name}</span>
      </div>
      <div className="chat-messages">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: msg.sender === 'user1' ? -20 : 20 }}
              transition={{ delay: index * 0.1 }}
              className={`chat-message ${msg.sender} ${msg.isSweet ? 'sweet' : ''}`}
            >
              <div className="message-bubble">
                <p>{msg.text}</p>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {msg.isSweet && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="sweet-indicator"
                >
                  ✨
                </motion.span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Share a sweet moment..."
          className="chat-input"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          className="chat-send-button"
        >
          💌
        </motion.button>
      </div>
    </div>
  );
};
