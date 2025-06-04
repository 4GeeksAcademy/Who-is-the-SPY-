import React from 'react';

const MissionVotingPanel = ({ playerRole, playerVoted, onVote }) => {
  const handleVote = (type) => {
    if (!playerVoted) onVote(type);
  };

  return (
    <div className="outcome-buttons">
      {playerVoted ? (
        <p>Has votado: {playerRole === 'spy' ? '✅/❌' : '✅'}</p>
      ) : (
        <>
          <button onClick={() => handleVote('success')}>✅ Misión Exitosa</button>
          {playerRole === 'spy' && (
            <button onClick={() => handleVote('fail')}>❌ Sabotaje</button>
          )}
        </>
      )}
    </div>
  );
};

export default MissionVotingPanel;