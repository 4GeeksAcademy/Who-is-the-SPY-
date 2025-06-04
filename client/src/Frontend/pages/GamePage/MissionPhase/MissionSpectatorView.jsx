import React from 'react';

const MissionSpectatorView = ({ players, missionTeam }) => {
  return (
    <div className="spectator-view">
      <h3>Jugadores en misión:</h3>
      <ul>
        {missionTeam.map((id) => {
          const player = players.find(p => p.id === id);
          return (
            <li key={id}>{player?.name || 'Jugador desconocido'}</li>
          );
        })}
      </ul>
    </div>
  );
};

export default MissionSpectatorView;