const express = require('express');
const app = express();
const PORT = 3000;

require('dotenv').config();
const axios = require('axios');
const { body, validationResult } = require('express-validator');

app.use(express.json());

app.post('/api/conversations', (req, res) => {
  res.status(201).send({ message: 'Conversation initialized', conversationId: '12345' });
});

async function fetchResponseFromOpenAI(prompt) {
  try {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
      prompt: prompt,
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return 'Sorry, I am unable to respond at the moment.';
  }
}

app.post('/api/messages', [
  body('conversationId').isString().trim().notEmpty(),
  body('message').isString().trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { conversationId, message } = req.body;
  const responseMessage = await fetchResponseFromOpenAI(message);
  res.status(200).send({ message: 'Message sent', conversationId, message: responseMessage });
});

app.get('/api/conversations/:conversationId', (req, res) => {
  const { conversationId } = req.params;
  res.status(200).send({ conversationId, messages: [] });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});