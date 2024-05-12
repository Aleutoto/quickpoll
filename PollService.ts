import axios, { AxiosError } from 'axios';

const baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const api = axios.create({ baseURL, });

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
  // Error handling remains unchanged
};

// Adding a cache for poll results
const pollResultsCache = new Map<string, PollResult>();

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
    // Invalidate cache when a new vote is cast
    if (pollResultsCache.has(vote.pollId)) {
      pollResultsCache.delete(vote.pollId);
    }
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
    // Check cache first
    if (pollResultsCache.has(pollId)) {
      return pollResultsCache.get(pollId) as PollResult;
    }
    
    const response = await api.get(`/polls/${pollId}/results`);
    // Cache the results
    pollResultsCache.set(pollId, response.data);
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