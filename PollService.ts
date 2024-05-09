import axios from 'axios';

const baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL,
});

interface Poll {
  question: string;
  options: string[];
}

interface Vote {
  pollId: string;
  option: string;
}

interface PollResult {
  pollId: string;
  results: { [option: string]: number };
}

export const createPoll = async (poll: Poll): Promise<Poll | string> => {
  try {
    const response = await api.post('/polls', poll);
    return response.data;
  } catch (error) {
    console.error('Error creating poll:', error);
    return 'Error creating poll';
  }
};

export const castVote = async (vote: Vote): Promise<Vote | string> => {
  try {
    const response = await api.post('/vote', vote);
    return response.data;
  } catch (error) {
    console.error('Error casting vote:', error);
    return 'Error casting vote';
  }
};

export const fetchPollResults = async (pollId: string): Promise<PollResult | string> => {
  try {
    const response = await api.get(`/polls/${pollId}/results`);
    return response.data;
  } catch (error) {
    console.error('Error fetching poll results:', error);
    return 'Error fetching poll results';
  }
};