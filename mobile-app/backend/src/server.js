const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json());

// AI Service
const AIService = require('./services/aiService');

// Routes
app.post('/api/ai/train', async (req, res) => {
  try {
    const { messages } = req.body;
    const aiService = new AIService();
    const personality = await aiService.trainFromMessages(messages);
    res.json({ success: true, personality });
  } catch (error) {
    console.error('Training error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/ai/generate', async (req, res) => {
  try {
    const { message, conversationHistory, personality } = req.body;
    const aiService = new AIService();
    const response = await aiService.generateResponse(
      message,
      conversationHistory,
      personality
    );
    res.json({ success: true, response });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/ai/active-message', async (req, res) => {
  try {
    const { personality } = req.body;
    const aiService = new AIService();
    const message = await aiService.generateActiveMessage(personality);
    res.json({ success: true, message });
  } catch (error) {
    console.error('Active message error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Love AI Backend running on port ${PORT}`);
});
