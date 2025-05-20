import React, { useState } from 'react';

const VotingPhase = ({ missionTeam, players, onVote, votes, currentUserId }) => {
  const [hasVoted, setHasVoted] = useState(!!votes[currentUserId]);

  const handleVote = (decision) => {
    if (!hasVoted) {
      onVote(currentUserId, decision);
      setHasVoted(true);
    }
  };

  return (
    <div className="voting-phase">
      <h2>Votación del equipo</h2>
      <p>Se ha propuesto el siguiente equipo:</p>

      <ul className="team-list">
        {missionTeam.map((id) => {
          const player = players.find(p => p.id === id);
          return <li key={id}>{player?.name || 'Jugador desconocido'}</li>;
        })}
      </ul>

      {!hasVoted ? (
        <div className="vote-buttons">
          <button onClick={() => handleVote(true)}>✅ Aprobar</button>
          <button onClick={() => handleVote(false)}>❌ Rechazar</button>
        </div>
      ) : (
        <p>Has votado. Esperando a los demás...</p>
      )}

      <div className="vote-status">
        <h3>Votos actuales:</h3>
        <ul>
          {players.map(player => (
            <li key={player.id}>
              {player.name}: {votes[player.id] === undefined ? '⏳' : votes[player.id] ? '✅' : '❌'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VotingPhase;