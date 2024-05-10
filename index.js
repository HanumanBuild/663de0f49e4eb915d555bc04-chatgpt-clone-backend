const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/api/conversations', (req, res) => {
  res.status(201).send({ message: 'Conversation initialized', conversationId: '12345' });
});

app.post('/api/messages', (req, res) => {
  const { conversationId, message } = req.body;
  res.status(200).send({ message: 'Message sent', conversationId, message });
});

app.get('/api/conversations/:conversationId', (req, res) => {
  const { conversationId } = req.params;
  res.status(200).send({ conversationId, messages: [] });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});