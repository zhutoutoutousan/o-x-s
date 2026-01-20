import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';

export interface Message {
  id: string;
  text: string;
  sender: 'user1' | 'user2';
  timestamp: Date;
  isSweet?: boolean;
}

export interface ChatProps {
  user1Name?: string;
  user2Name?: string;
  messages?: Message[];
  onSendMessage?: (text: string) => void;
  className?: string;
}

export const Chat: React.FC<ChatProps> = ({
  user1Name = 'Sue',
  user2Name = 'Owen',
  messages: initialMessages = [],
  onSendMessage,
  className = ''
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
      isSweet: input.toLowerCase().includes('love') || input.toLowerCase().includes('❤️')
    };

    setMessages(prev => [...prev, newMessage]);
    onSendMessage?.(input);
    setInput('');
  };

  return (
    <div className={`chat-container ${className}`}>
      <div className="chat-header">
        <h3>💕 Sweet Moments</h3>
        <span className="chat-subtitle">{user1Name} & {user2Name}</span>
      </div>
      <div className="chat-messages">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`chat-message ${msg.sender} ${msg.isSweet ? 'sweet' : ''}`}
          >
            <div className="message-bubble">
              <p>{msg.text}</p>
              <span className="message-time">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {msg.isSweet && <span className="sweet-indicator">✨</span>}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a sweet message..."
          className="chat-input"
        />
        <button onClick={handleSend} className="chat-send-button">
          💌
        </button>
      </div>
    </div>
  );
};
