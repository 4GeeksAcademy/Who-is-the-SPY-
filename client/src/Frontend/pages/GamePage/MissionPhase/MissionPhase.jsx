import React, { useState, useEffect } from 'react';

const MissionPhase = ({ missionSuccess, onMissionOutcome, players, missionTeam, userId }) => {
  const [votes, setVotes] = useState({}); // { playerId: 'success' | 'fail' }

  const playerInMission = missionTeam.includes(userId);
  const playerRole = players.find(p => p.id === userId)?.role;

  // Agentes solo pueden votar éxito, espías pueden votar éxito o sabotaje (fail)
  const canVote = playerInMission && missionSuccess === null;

  // Actualiza votos localmente y en el estado
  const handleVote = (voteType) => {
    setVotes(prev => ({ ...prev, [userId]: voteType }));
  };

  // Enviar votos al componente padre cuando todos hayan votado
  useEffect(() => {
    if (Object.keys(votes).length === missionTeam.length) {
      onMissionOutcome(votes);
    }
  }, [votes, missionTeam.length, onMissionOutcome]);

  // Checar si el jugador ya votó
  const playerVoted = votes[userId] !== undefined;

  // Mostrar texto de voto del jugador
  const voteText = {
    success: '✅ Misión Exitosa',
    fail: '❌ Sabotaje',
  };

  return (
    <div className="mission-phase">
      <h2>Fase de Misión</h2>

      {missionSuccess !== null ? (
        <p>Resultado de la misión: {
          missionSuccess === 'success' ? '✅ Éxito' :
          missionSuccess === 'fail' ? '❌ Fracaso' :
          '⚠️ Corrupción (falta de votos)'
        }</p>
      ) : (
        <>
          {canVote ? (
            <>
              {!playerVoted ? (
                <div className="outcome-buttons">
                  {/* Agentes solo ven botón éxito */}
                  {playerRole === 'agent' && (
                    <button onClick={() => handleVote('success')}>✅ Misión Exitosa</button>
                  )}
                  {/* Espías ven ambos */}
                  {playerRole === 'spy' && (
                    <>
                      <button onClick={() => handleVote('success')}>✅ Misión Exitosa</button>
                      <button onClick={() => handleVote('fail')}>❌ Sabotaje</button>
                    </>
                  )}
                </div>
              ) : (
                <p>Has votado: {voteText[votes[userId]]}</p>
              )}
            </>
          ) : (
            <p>Esperando votos de los miembros en misión...</p>
          )}
        </>
      )}

      <div className="mission-status">
        <h3>Estado de los jugadores:</h3>
        <ul>
          {players.map(player => (
            <li key={player.id}>
              {player.name} ({player.role === 'spy' ? 'Espía' : 'Agente'})
              {missionTeam.includes(player.id) && ' - En misión'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MissionPhase;