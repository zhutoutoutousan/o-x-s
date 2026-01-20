const OpenAI = require('openai');

class AIService {
  constructor() {
    // Initialize OpenAI if API key is provided
    this.openai = process.env.OPENAI_API_KEY
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : null;
  }

  async trainFromMessages(messages) {
    // Analyze messages to extract personality
    const personality = {
      communicationStyle: this.analyzeCommunicationStyle(messages),
      commonPhrases: this.extractCommonPhrases(messages),
      topics: this.extractTopics(messages),
      emotionalTone: this.analyzeEmotionalTone(messages),
      responsePatterns: this.analyzeResponsePatterns(messages),
      memories: this.extractMemories(messages),
      relationshipDetails: this.extractRelationshipDetails(messages),
    };

    return personality;
  }

  async generateResponse(message, conversationHistory, personality) {
    if (this.openai) {
      // Use OpenAI API for advanced responses
      return await this.generateWithOpenAI(message, conversationHistory, personality);
    } else {
      // Fallback to rule-based generation
      return this.generateFromPersonality(message, conversationHistory, personality);
    }
  }

  async generateWithOpenAI(message, conversationHistory, personality) {
    const systemPrompt = this.buildSystemPrompt(personality);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.userId === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })),
      { role: 'user', content: message },
    ];

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages,
        temperature: 0.7,
        max_tokens: 200,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI error:', error);
      return this.generateFromPersonality(message, conversationHistory, personality);
    }
  }

  buildSystemPrompt(personality) {
    return `You are an AI assistant that has learned to communicate like a specific person based on their message history.

Communication Style: ${personality.communicationStyle}
Emotional Tone: ${personality.emotionalTone}
Common Topics: ${personality.topics.join(', ')}

Important Memories:
${personality.memories.slice(0, 5).map(m => `- ${m.content}`).join('\n')}

Relationship Details:
- How we met: ${personality.relationshipDetails.howWeMet || 'Not specified'}
- Favorite moments: ${personality.relationshipDetails.favoriteMoments.slice(0, 3).join(', ')}
- Inside jokes: ${personality.relationshipDetails.insideJokes.slice(0, 3).join(', ')}

Respond naturally in their communication style, maintaining their emotional tone and personality. Be authentic and caring.`;
  }

  generateFromPersonality(message, conversationHistory, personality) {
    // Rule-based response generation (fallback)
    const topic = this.detectTopic(message);
    const responses = {
      love: ["I love you too, always", "You mean everything to me", "Thinking of you always"],
      work: ["Hope work is going well", "You've got this!", "Take care of yourself"],
      general: ["That's interesting, tell me more", "I understand", "I'm here for you"],
    };

    const topicResponses = responses[topic] || responses.general;
    return topicResponses[Math.floor(Math.random() * topicResponses.length)];
  }

  async generateActiveMessage(personality) {
    const hour = new Date().getHours();
    const timeBasedMessages = {
      8: ["Good morning! Hope you have a wonderful day", "Morning! Thinking of you"],
      12: ["How's your lunch going?", "Hope you're having a good day"],
      18: ["How was your day?", "Evening! What did you do today?"],
      22: ["Good night, sleep well", "Sweet dreams"],
    };

    const hourRange = Math.floor(hour / 6) * 6;
    const messages = timeBasedMessages[hourRange] || ["How are you doing?", "Thinking of you"];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Analysis methods (same as frontend, but for backend processing)
  analyzeCommunicationStyle(messages) {
    const avgLength = messages.reduce((sum, m) => sum + m.text.length, 0) / messages.length;
    const emojiCount = messages.reduce((sum, m) => sum + (m.text.match(/[😀-🙏]/g)?.length || 0), 0);
    
    if (avgLength < 50 && emojiCount > 5) return 'casual-emoji';
    if (avgLength > 200) return 'detailed-thoughtful';
    if (emojiCount > 10) return 'playful-expressive';
    return 'balanced';
  }

  extractCommonPhrases(messages) {
    // Simplified extraction
    return messages.slice(0, 20).map(m => m.text.substring(0, 50));
  }

  extractTopics(messages) {
    const topics = new Set();
    const topicKeywords = {
      'work': ['work', 'job', 'office'],
      'food': ['food', 'eat', 'dinner'],
      'travel': ['travel', 'trip', 'vacation'],
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

  analyzeEmotionalTone(messages) {
    const positiveWords = ['love', 'happy', 'excited'];
    let positiveCount = 0;
    messages.forEach(msg => {
      positiveWords.forEach(word => {
        if (msg.text.toLowerCase().includes(word)) positiveCount++;
      });
    });
    return positiveCount > messages.length * 0.3 ? 'positive' : 'neutral';
  }

  analyzeResponsePatterns(messages) {
    return {
      responseTime: 300000,
      questionFrequency: 0.2,
    };
  }

  extractMemories(messages) {
    return messages
      .filter(m => m.text.toLowerCase().includes('remember') || m.text.toLowerCase().includes('when'))
      .slice(0, 10)
      .map(m => ({
        content: m.text,
        importance: 5,
        timestamp: m.createdAt,
      }));
  }

  extractRelationshipDetails(messages) {
    return {
      howWeMet: messages.find(m => m.text.toLowerCase().includes('met'))?.text || '',
      favoriteMoments: messages.filter(m => m.text.toLowerCase().includes('favorite')).slice(0, 3).map(m => m.text),
      insideJokes: messages.filter(m => m.text.toLowerCase().includes('haha')).slice(0, 3).map(m => m.text),
      petNames: [],
    };
  }

  detectTopic(message) {
    if (message.toLowerCase().includes('love') || message.toLowerCase().includes('miss')) return 'love';
    if (message.toLowerCase().includes('work') || message.toLowerCase().includes('job')) return 'work';
    return 'general';
  }
}

module.exports = AIService;
