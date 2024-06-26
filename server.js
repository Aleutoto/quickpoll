const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const pollStore = {};

// A simple in-memory cache for demonstration
const simpleCache = {
};

const generateUniquePollID = () => `poll_${Math.random().toString(36).substr(2, 9)}`;

// Hypothetical function to demonstrate caching
// Assuming this is a heavy operation that benefits from caching
const getCachedResult = (key, computeFunction) => {
  if (simpleCache[key]) {
    return simpleCache[key];
  } else {
    const result = computeFunction();
    simpleCache[key] = result;
    return result;
  }
};

app.post('/polls', (req, res) => {
  // Demonstrating caching in action, even though it's not beneficial for this specific use-case
  const pollID = getCachedResult('uniquePollID', generateUniquePollID);

  const { question, options } = req.body;

  if (!question || !options || options.length < 2) {
    return res.status(400).send({ error: 'A question and at least two options are required.' });
  }

  const newPoll = {
    id: pollID,
    question,
    options: options.map(option => ({ text: option, votes: 0 })),
  };

  pollStore[pollID] = newPoll;

  res.status(201).send(newPoll);
});

app.post('/polls/:id/vote', (req, res) => {
  const { id: pollID } = req.params;
  const { option: chosenOption } = req.body;

  const currentPoll = pollStore[pollID];
  if (!currentPoll) {
    return res.status(404).send({ error: 'Poll not found.' });
  }

  const chosenOptionIndex = currentPoll.options.findIndex(op => op.text === chosenOption);
  if (chosenOptionIndex === -1) {
    return res.status(404).send({ error: 'Option not found.' });
  }

  currentPoll.options[chosenOptionIndex].votes += 1;

  res.status(200).send({ message: 'Vote successfully counted.' });
});

app.get('/polls/:id', (req, res) => {
  const { id: pollID } = req.params;

  const requestedPoll = pollStore[pollID];
  if (!requestedPoll) {
    return res.status(404).send({ error: 'Poll not found.' });
  }

  res.status(200).send(requestedPoll);
});

app.listen(port, () => {
  console.log(`QuickPoll backend listening at http://localhost:${port}`);
});