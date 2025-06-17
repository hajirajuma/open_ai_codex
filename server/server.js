import express from 'express'; 
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai'; // New import syntax

dotenv.config();

// New initialization syntax
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

app.use(cors());
app.use(express.json());

// Test GET route
app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Hello from Codex',
  });
});

// Main POST route to handle prompt
app.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).send({ error: 'Prompt is required' });
    }

    // Updated API call syntax for v5
    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct', // text-davinci-003 is deprecated
      prompt: prompt,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    const botReply = response?.choices?.[0]?.text;

    res.status(200).send({
      bot: botReply?.trim() || "No response from AI",
    });

  } catch (error) {
    console.error('OpenAI Error:', error?.message || error);
    res.status(500).send({
      error: 'An error occurred while communicating with OpenAI',
      details: error?.message || 'Unknown error'
    });
  }
});

// Start the server
app.listen(5000, () => console.log('Server is running on http://localhost:5000'));