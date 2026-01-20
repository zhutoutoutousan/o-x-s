import { Message, AIPersonality } from '../types';

export class AIService {
  private apiUrl = process.env.EXPO_PUBLIC_AI_API_URL || 'http://localhost:3002/api';

  async trainFromMessages(
    messages: Message[],
    onProgress?: (progress: number) => void
  ): Promise<AIPersonality> {
    // Analyze messages to extract personality traits
    const personality: AIPersonality = {
      communicationStyle: this.analyzeCommunicationStyle(messages),
      commonPhrases: this.extractCommonPhrases(messages),
      topics: this.extractTopics(messages),
      emotionalTone: this.analyzeEmotionalTone(messages),
      responsePatterns: this.analyzeResponsePatterns(messages),
      memories: this.extractMemories(messages),
      relationshipDetails: this.extractRelationshipDetails(messages),
    };

    // Simulate training progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      onProgress?.(i);
    }

    return personality;
  }

  async generateResponse(
    message: string,
    conversationHistory: Message[],
    personality: AIPersonality
  ): Promise<string> {
    // In production, this would call an AI API (OpenAI, Anthropic, etc.)
    // For now, we'll generate responses based on learned patterns
    
    const context = this.getContext(message, conversationHistory, personality);
    const response = this.generateFromPersonality(message, context, personality);
    
    return response;
  }

  async generateActiveMessage(personality: AIPersonality): Promise<string> {
    // Generate proactive messages based on time of day, memories, etc.
    const hour = new Date().getHours();
    const topics = [
      "How's your day going?",
      "I was just thinking about you",
      "Remember when we...",
      "I miss you",
      "What are you up to?",
    ];

    const timeBasedMessages: { [key: number]: string[] } = {
      8: ["Good morning! Hope you have a wonderful day", "Morning! Thinking of you"],
      12: ["How's your lunch going?", "Hope you're having a good day"],
      18: ["How was your day?", "Evening! What did you do today?"],
      22: ["Good night, sleep well", "Sweet dreams"],
    };

    const hourRange = Math.floor(hour / 6) * 6;
    const messages = timeBasedMessages[hourRange] || topics;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Add personal touches from memories
    if (personality.memories.length > 0 && Math.random() > 0.5) {
      const memory = personality.memories[Math.floor(Math.random() * personality.memories.length)];
      return `${randomMessage}. ${memory.content}`;
    }

    return randomMessage;
  }

  private analyzeCommunicationStyle(messages: Message[]): string {
    const avgLength = messages.reduce((sum, m) => sum + m.text.length, 0) / messages.length;
    const emojiCount = messages.reduce((sum, m) => sum + (m.text.match(/[😀-🙏]/g)?.length || 0), 0);
    
    if (avgLength < 50 && emojiCount > 5) return 'casual-emoji';
    if (avgLength > 200) return 'detailed-thoughtful';
    if (emojiCount > 10) return 'playful-expressive';
    return 'balanced';
  }

  private extractCommonPhrases(messages: Message[]): string[] {
    const phrases = new Map<string, number>();
    const commonWords = ['love', 'you', 'miss', 'think', 'wish', 'hope', 'always', 'forever'];
    
    messages.forEach(msg => {
      commonWords.forEach(word => {
        if (msg.text.toLowerCase().includes(word)) {
          const phrase = this.extractPhraseAroundWord(msg.text, word);
          phrases.set(phrase, (phrases.get(phrase) || 0) + 1);
        }
      });
    });

    return Array.from(phrases.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([phrase]) => phrase);
  }

  private extractPhraseAroundWord(text: string, word: string): string {
    const index = text.toLowerCase().indexOf(word);
    if (index === -1) return '';
    const start = Math.max(0, index - 10);
    const end = Math.min(text.length, index + word.length + 10);
    return text.substring(start, end).trim();
  }

  private extractTopics(messages: Message[]): string[] {
    const topics = new Set<string>();
    const topicKeywords: { [key: string]: string[] } = {
      'work': ['work', 'job', 'office', 'meeting'],
      'food': ['food', 'eat', 'dinner', 'lunch', 'cooking'],
      'travel': ['travel', 'trip', 'vacation', 'flight'],
      'family': ['family', 'mom', 'dad', 'parents'],
      'hobbies': ['hobby', 'game', 'movie', 'book', 'music'],
    };

    messages.forEach(msg => {
      Object.entries(topicKeywords).forEach(([topic, keywords]) => {
        if (keywords.some(kw => msg.text.toLowerCase().includes(kw))) {
          topics.add(topic);
        }
      });
    });

    return Array.from(topics);
  }

  private analyzeEmotionalTone(messages: Message[]): string {
    const positiveWords = ['love', 'happy', 'excited', 'wonderful', 'amazing', 'beautiful'];
    const negativeWords = ['sad', 'miss', 'worry', 'stress', 'tired'];
    
    let positiveCount = 0;
    let negativeCount = 0;

    messages.forEach(msg => {
      const lower = msg.text.toLowerCase();
      positiveWords.forEach(word => {
        if (lower.includes(word)) positiveCount++;
      });
      negativeWords.forEach(word => {
        if (lower.includes(word)) negativeCount++;
      });
    });

    if (positiveCount > negativeCount * 2) return 'very-positive';
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'supportive';
    return 'neutral';
  }

  private analyzeResponsePatterns(messages: Message[]): any {
    const patterns = {
      responseTime: this.calculateAverageResponseTime(messages),
      questionFrequency: messages.filter(m => m.text.includes('?')).length / messages.length,
      exclamationFrequency: messages.filter(m => m.text.includes('!')).length / messages.length,
    };
    return patterns;
  }

  private calculateAverageResponseTime(messages: Message[]): number {
    let totalTime = 0;
    let count = 0;

    for (let i = 1; i < messages.length; i++) {
      const timeDiff = messages[i].createdAt.getTime() - messages[i - 1].createdAt.getTime();
      if (timeDiff > 0 && timeDiff < 3600000) { // Less than 1 hour
        totalTime += timeDiff;
        count++;
      }
    }

    return count > 0 ? totalTime / count : 300000; // Default 5 minutes
  }

  private extractMemories(messages: Message[]): Array<{ content: string; importance: number; timestamp: string }> {
    const memories: Array<{ content: string; importance: number; timestamp: string }> = [];
    const memoryKeywords = ['remember', 'when we', 'that time', 'first', 'always', 'never forget'];

    messages.forEach(msg => {
      memoryKeywords.forEach(keyword => {
        if (msg.text.toLowerCase().includes(keyword)) {
          memories.push({
            content: msg.text,
            importance: this.calculateImportance(msg.text),
            timestamp: msg.createdAt.toISOString(),
          });
        }
      });
    });

    return memories.sort((a, b) => b.importance - a.importance).slice(0, 50);
  }

  private calculateImportance(text: string): number {
    let importance = 1;
    const importantWords = ['first', 'always', 'never', 'forever', 'special', 'amazing'];
    importantWords.forEach(word => {
      if (text.toLowerCase().includes(word)) importance += 2;
    });
    return importance;
  }

  private extractRelationshipDetails(messages: Message[]): any {
    const details = {
      howWeMet: '',
      favoriteMoments: [] as string[],
      insideJokes: [] as string[],
      petNames: [] as string[],
    };

    messages.forEach(msg => {
      const lower = msg.text.toLowerCase();
      if (lower.includes('met') || lower.includes('first time')) {
        details.howWeMet = msg.text;
      }
      if (lower.includes('favorite') || lower.includes('best moment')) {
        details.favoriteMoments.push(msg.text);
      }
      if (lower.includes('haha') || lower.includes('lol') || lower.includes('funny')) {
        details.insideJokes.push(msg.text);
      }
      const petNamePattern = /(?:my|your|our)\s+(\w+)/gi;
      const matches = msg.text.match(petNamePattern);
      if (matches) {
        details.petNames.push(...matches);
      }
    });

    return details;
  }

  private getContext(message: string, history: Message[], personality: AIPersonality): any {
    const recentMessages = history.slice(-5);
    const context = {
      recentConversation: recentMessages.map(m => m.text).join(' '),
      currentTopic: this.detectTopic(message),
      emotionalState: this.detectEmotion(message),
      personality,
    };
    return context;
  }

  private detectTopic(message: string): string {
    const topics: { [key: string]: string[] } = {
      'work': ['work', 'job', 'office'],
      'food': ['food', 'eat', 'hungry', 'dinner'],
      'love': ['love', 'miss', 'care', 'heart'],
      'plans': ['plan', 'tomorrow', 'weekend', 'next'],
    };

    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some(kw => message.toLowerCase().includes(kw))) {
        return topic;
      }
    }
    return 'general';
  }

  private detectEmotion(message: string): string {
    if (message.match(/[😀😊😍❤️💕]/)) return 'happy';
    if (message.match(/[😢😭💔]/)) return 'sad';
    if (message.match(/[😍🔥💯]/)) return 'excited';
    if (message.includes('?')) return 'curious';
    return 'neutral';
  }

  private generateFromPersonality(
    message: string,
    context: any,
    personality: AIPersonality
  ): string {
    // Generate response based on learned personality
    const style = personality.communicationStyle;
    const tone = personality.emotionalTone;
    const topic = context.currentTopic;

    let response = '';

    // Use common phrases if applicable
    if (personality.commonPhrases.length > 0 && Math.random() > 0.7) {
      response = personality.commonPhrases[Math.floor(Math.random() * personality.commonPhrases.length)];
    } else {
      // Generate contextual response
      if (topic === 'love') {
        response = this.generateLoveResponse(message, personality);
      } else if (topic === 'work') {
        response = this.generateWorkResponse(message, personality);
      } else {
        response = this.generateGeneralResponse(message, personality);
      }
    }

    // Add emojis based on style
    if (style.includes('emoji') || style.includes('playful')) {
      const emojis = ['❤️', '💕', '😊', '✨', '💖'];
      response += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
    }

    return response;
  }

  private generateLoveResponse(message: string, personality: AIPersonality): string {
    const responses = [
      "I love you too, always",
      "You mean everything to me",
      "Thinking of you always",
      "You're my everything",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateWorkResponse(message: string, personality: AIPersonality): string {
    const responses = [
      "Hope work is going well",
      "You've got this!",
      "Can't wait to hear about your day",
      "Take care of yourself",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateGeneralResponse(message: string, personality: AIPersonality): string {
    const responses = [
      "That's interesting, tell me more",
      "I understand",
      "I'm here for you",
      "That sounds great",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}
