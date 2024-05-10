import axios, { AxiosError } from 'axios';

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

const handleError = (error: AxiosError): string => {
  if (error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    console.error('Response headers:', error.response.headers);
    return `Server responded with status code ${error.response.status}`;
  } else if (error.request) {
    console.error('Request made but no response:', error.request);
    return 'Request made but no response received';
  } else {
    console.error('Error message:', error.message);
    return `Request setup failed: ${error.message}`;
  }
};

export const createPoll = async (poll: Poll): Promise<Poll | string> => {
  try {
    const response = await api.post('/polls', poll);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return handleError(error);
    } else {
      console.error('Error creating poll:', error);
      return 'Unknown error occurred while creating poll';
    }
  }
};

export const castVote = async (vote: Vote): Promise<Vote | string> => {
  try {
    const response = await api.post('/vote', vote);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return handleError(error);
    } else {
      console.error('Error casting vote:', error);
      return 'Unknown error occurred while casting vote';
    }
  }
};

export const fetchPollResults = async (pollId: string): Promise<PollResult | string> => {
  try {
    const response = await api.get(`/polls/${pollId}/results`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return handleError(error);
    } else {
      console.error('Error fetching poll results:', error);
      return 'Unknown error occurred while fetching poll results';
    }
  }
};