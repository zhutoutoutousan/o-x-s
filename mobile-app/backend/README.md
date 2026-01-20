# Love AI Backend API

Backend server for the Love AI Messenger mobile app, handling AI training and response generation.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your OpenAI API key (optional)
npm start
```

## API Endpoints

### POST /api/ai/train
Train AI from messages
```json
{
  "messages": [...]
}
```

### POST /api/ai/generate
Generate AI response
```json
{
  "message": "Hello",
  "conversationHistory": [...],
  "personality": {...}
}
```

### POST /api/ai/active-message
Generate proactive message
```json
{
  "personality": {...}
}
```

### GET /api/health
Health check endpoint

## Environment Variables

- `PORT` - Server port (default: 3002)
- `OPENAI_API_KEY` - OpenAI API key for advanced AI (optional)

## Notes

- Without OpenAI API key, the system uses rule-based responses
- With OpenAI API key, uses GPT-4 for more natural responses
- All personality analysis happens locally for privacy
