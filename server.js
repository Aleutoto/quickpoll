const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const polls = {};

const generateID = () => `poll_${Math.random().toString(36).substr(2, 9)}`;

app.post('/polls', (req, res) => {
  const id = generateID();
  const { question, options } = req.body;

  if (!question || !options || options.length < 2) {
    return res.status(400).send({ error: 'A question and at least two options are required.' });
  }

  const newPoll = {
    id,
    question,
    options: options.map(option => ({ option, votes: 0 })),
  };

  polls[id] = newPoll;

  res.status(201).send(newPoll);
});

app.post('/polls/:id/vote', (req, res) => {
  const { id } = req.params;
  const { option } = req.body;

  const poll = polls[id];
  if (!poll) {
    return res.status(404).send({ error: 'Poll not found.' });
  }

  const optionIndex = poll.options.findIndex(op => op.option === option);
  if (optionIndex === -1) {
    return res.status(404).send({ error: 'Option not found.' });
  }

  poll.options[optionIndex].votes += 1;

  res.status(200).send({ message: 'Vote successfully counted.' });
});

app.get('/polls/:id', (req, res) => {
  const { id } = req.params;

  const poll = polls[id];
  if (!poll) {
    return res.status(404).send({ error: 'Poll not found.' });
  }

  res.status(200).send(poll);
});

app.listen(port, () => {
  console.log(`QuickPoll backend listening at http://localhost:${port}`);
});