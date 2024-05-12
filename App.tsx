import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    const fetchedPolls: Poll[] = [];
    setPolls(fetchedPolls);
  }, []);

  const handleCreatePoll = () => {
    const newPoll: Poll = {
      id: Date.now(),
      question: newPollQuestion,
      options: newPollOptions.map((option, index) => ({
        id: index,
        text: option,
        votes: 0,
      })),
    };
    setPolls([...polls, newPoll]);
    setCurrentPoll(newPoll);
    // Clear inputs after creating a poll.
    setNewPollQuestion('');
    setNewPollOptions(['', '']);
  };

  const handleVote = (pollId: number, optionId: number) => {
    const updatedPolls = polls.map(poll => {
      if (poll.id === pollId) {
        const options = poll.options.map(option => {
          if (option.id === optionId) {
            return { ...option, votes: option.votes + 1 };
          }
          return option;
        });
        return { ...poll, options };
      }
      return poll;
    });
    setPolls(updatedPolls);
  };

  const handleAddOption = () => {
    setNewPollOptions([...newPollOptions, '']);
  }

  const handleDeleteOption = (index: number) => {
    setNewPollOptions(newPollOptions.filter((_, idx) => idx !== index));
  }

  return (
    <div>
      <section>
        <h2>Create a New Poll</h2>
        <input
          type='text'
          placeholder='Poll Question'
          value={newPollQuestion}
          onChange={(e) => setNewPollQuestion(e.target.value)}
        />
        <div>
          {newPollOptions.map((option, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <input
                type='text'
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...newPollOptions];
                  newOptions[index] = e.target.value;
                  setNewPollOptions(newOptions);
                }}
                style={{ marginRight: '5px' }}
              />
              <button onClick={() => handleDeleteOption(index)}>Delete</button>
            </div>
          ))}
        </div>
        <button onClick={handleAddOption}>
          Add Option
        </button>
        <button onClick={handleCreatePoll}>Create Poll</button>
      </section>

      <section>
        <h2>Active Poll</h2>
        {currentPoll ? (
          <>
            <h3>{currentPoll.question}</h3>
            <ul>
              {currentPoll.options.map((option) => (
                <li key={option.id} onClick={() => handleVote(currentPoll.id, option.id)}>
                  {option.text} - Votes: {option.votes}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No active poll.</p>
        )}
      </section>
    </div>
  );
};

export default QuickPoll;