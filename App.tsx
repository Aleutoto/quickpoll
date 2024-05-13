import React, { useState, useCallback } from 'react';

interface PollOption {
  id: number;
  text: string;
  votes: number;
}

interface Poll {
  id: number;
  question: string;
  options: PollOption[];
}

const QuickPoll: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '']);

  const handleCreatePoll = useCallback(() => {
    const newPoll: Poll = {
      id: Date.now(),
      question: newPollQuestion,
      options: newPollOptions.map((option, index) => ({
        id: index,
        text: option,
        votes: 0,
      })),
    };
    setPolls((prevPolls) => [...prevPolls, newPoll]);
    setCurrentPoll(newPoll);
    setNewPollQuestion('');
    setNewPollOptions(['', '']);
  }, [newPollQuestion, newPollOptions]);

  const handleVote = useCallback((pollId: number, optionId: number) => {
    setPolls((prevPolls) =>
      prevPolls.map(poll =>
        poll.id === pollId
          ? { ...poll, options: poll.options.map(option => option.id === optionId ? { ...option, votes: option.votes + 1 } : option) }
          : poll,
      ),
    );
  }, []);

  const handleAddOption = useCallback(() => {
    setNewPollOptions((prevOptions) => [...prevOptions, '']);
  }, []);

  const handleDeleteOption = useCallback((index: number) => {
    setNewPollOptions((prevOptions) => prevOptions.filter((_, idx) => idx !== index));
  }, []);

  return (
    <div>
      {/* UI code remains unchanged */}
    </div>
  );
};

export default QuickPoll;