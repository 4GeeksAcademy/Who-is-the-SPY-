import React, { useState, useEffect } from 'react';
import MissionVotingPanel from './MissionVotingPanel';
import MissionSpectatorView from './MissionSpectatorView';
import MissionTimer from './MissionTimer';
import MissionResultBanner from './MissionResultBanner';
import './MissionPhase.css';


const MissionPhase = ({ missionSuccess, onMissionOutcome, players, missionTeam, userId, missionDuration = 30 }) => {
  const [votes, setVotes] = useState({}); // { playerId: 'success' | 'fail' }
  const [timerExpired, setTimerExpired] = useState(false);

  const playerInMission = missionTeam.includes(userId);
  const playerRole = players.find(p => p.id === userId)?.role;

  const canVote = playerInMission && missionSuccess === null && !timerExpired;
  const playerVoted = votes[userId] !== undefined;

  // Maneja la votación de un jugador
  const handleVote = (voteType) => {
    if (canVote && !playerVoted) {
      setVotes(prev => ({ ...prev, [userId]: voteType }));
    }
  };

  // Cuando se acaba el tiempo o todos votaron, se envía el resultado al padre
  useEffect(() => {
    if (Object.keys(votes).length === missionTeam.length) {
      onMissionOutcome(votes);
    }
  }, [votes, missionTeam.length, onMissionOutcome]);

  useEffect(() => {
    if (timerExpired && Object.keys(votes).length < missionTeam.length) {
      // Si el tiempo expiró y no todos votaron, consideramos votos faltantes como "no votado" (puedes definir lógica)
      onMissionOutcome(votes);
    }
  }, [timerExpired, votes, missionTeam.length, onMissionOutcome]);

  // Determinar resultado para el banner (usa misión que viene del padre o 'corrupted' si no hay votos)
  const missionResult = missionSuccess !== null
    ? missionSuccess
    : (timerExpired && Object.keys(votes).length < missionTeam.length ? 'corrupted' : null);

  return (
    <div className="mission-phase">

      <h2>Fase de Misión</h2>

      {/* Vista del jugador en misión para votar */}
      {playerInMission && missionSuccess === null && !timerExpired && (
        <MissionVotingPanel
          playerRole={playerRole}
          playerVoted={playerVoted}
          onVote={handleVote}
        />
      )}

      {/* Vista espectador para los no participantes o cuando ya terminó la misión */}
      {(!playerInMission || missionSuccess !== null || timerExpired) && (
        <MissionSpectatorView
          players={players}
          missionTeam={missionTeam}
        />
      )}

      {/* Temporizador activo solo si la misión está en curso y el jugador puede votar */}
      {(missionSuccess === null && !timerExpired) && (
        <MissionTimer
          duration={missionDuration}
          onExpire={() => setTimerExpired(true)}
        />
      )}

      {/* Banner de resultado visible si la misión terminó o hubo corrupción */}
      {(missionResult) && (
        <MissionResultBanner result={missionResult} />
      )}

      {/* Estado general de jugadores */}
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