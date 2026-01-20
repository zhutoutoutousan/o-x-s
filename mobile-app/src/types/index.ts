export interface Message {
  id: string;
  text: string;
  userId: string;
  createdAt: Date;
  image?: string;
  system?: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  isAI: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AIPersonality {
  communicationStyle: string;
  commonPhrases: string[];
  topics: string[];
  emotionalTone: string;
  responsePatterns: any;
  memories: Array<{
    content: string;
    importance: number;
    timestamp: string;
  }>;
  relationshipDetails: {
    howWeMet: string;
    favoriteMoments: string[];
    insideJokes: string[];
    petNames: string[];
  };
}
