# Love AI Messenger - Mobile App

A mobile instant messaging application with AI capabilities that learns from conversations between lovers and can continue the relationship when needed.

## Features

- 💬 **Instant Messaging**: Beautiful chat interface for conversations
- 🤖 **AI Learning**: AI agent learns from your messages to understand communication style
- 💕 **Personality Capture**: Extracts communication patterns, emotional tone, and relationship details
- 🔄 **AI Assistant Mode**: AI can take the place of your loved one when activated
- 📱 **Active Messaging**: AI proactively messages you throughout the day
- 🧠 **Memory System**: Remembers important moments, inside jokes, and relationship details
- 📷 **Camera Integration**: Take photos and share memories

## Getting Started

### Prerequisites

- Node.js 20.19.4+ (recommended)
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (SDK 54)

### Installation

```bash
cd mobile-app
npm install
npm run generate-assets  # Generate placeholder assets
```

### Development

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Demo Data

The app comes with demo conversations (Sue and Owen) so you can see how it works immediately. You can:
- View existing conversations
- Start new conversations
- Take photos with the camera
- Train the AI assistant

## AI Training

1. **Start Conversations**: Chat normally with your loved one
2. **Train AI**: Go to AI Settings and train the AI (requires at least 10 messages)
3. **Activate AI**: Once trained, you can activate AI mode
4. **Active Messaging**: Enable proactive messaging for AI to message you throughout the day

## How It Works

### Learning Process

The AI analyzes:
- **Communication Style**: Message length, emoji usage, formality
- **Common Phrases**: Frequently used expressions and sayings
- **Topics**: What you talk about (work, food, travel, etc.)
- **Emotional Tone**: Positive, supportive, playful patterns
- **Response Patterns**: Response times, question frequency
- **Memories**: Important moments and conversations
- **Relationship Details**: How you met, favorite moments, inside jokes, pet names

### AI Response Generation

- Uses learned personality traits to generate responses
- Maintains communication style and emotional tone
- References memories and relationship details
- Adapts to conversation context

### Active Messaging

When enabled, the AI will:
- Message you at appropriate times (morning, lunch, evening, night)
- Reference memories and past conversations
- Check in about your day
- Maintain the relationship connection

## Camera Features

- Take photos with the camera button (📷)
- Switch between front and back camera
- Access photo gallery
- Preview and retake photos
- Share photos in conversations

## Sensitive Feature Notice

The AI activation feature is designed for sensitive situations. Please use with care and understanding. The AI learns from your conversations but is not a replacement for human connection.

## Tech Stack

- **React Native** - Mobile framework
- **Expo SDK 54** - Development platform
- **React Navigation** - Navigation
- **Gifted Chat** - Chat UI
- **React Native Reanimated** - Animations
- **AsyncStorage** - Local storage
- **TypeScript** - Type safety

## Project Structure

```
mobile-app/
├── src/
│   ├── context/       # React context providers (Chat, AI)
│   ├── screens/       # App screens (Chat, Conversations, AI Settings, Camera)
│   ├── services/      # AI service and API
│   └── types/         # TypeScript types
├── assets/            # App icons and splash screens
├── scripts/           # Utility scripts
├── App.tsx            # Main app component
└── package.json
```

## Troubleshooting

### Worklets Error
If you see a worklets version mismatch:
1. Make sure `react-native-reanimated` is installed
2. Check that `babel.config.js` includes the reanimated plugin (must be last)
3. Clear cache: `npx expo start --clear`

### SDK Mismatch
If Expo Go shows SDK mismatch:
- Make sure you're using Expo Go SDK 54
- Update Expo Go app from App Store/Play Store
- Check `package.json` has `expo: "~54.0.0"`

### App Stuck on Splash
- The app includes demo data that loads automatically
- If stuck, try clearing app data and restarting
- Check console for any errors

## Future Enhancements

- Backend API integration for cloud AI processing
- Voice message support
- Photo sharing in chat
- End-to-end encryption
- Multi-device sync
- Advanced AI models (GPT, Claude integration)
- Video calling

## License

See main project LICENSE file.
