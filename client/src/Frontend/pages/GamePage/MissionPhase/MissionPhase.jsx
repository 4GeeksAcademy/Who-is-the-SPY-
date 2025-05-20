import React, { useState } from 'react';

const MissionPhase = ({ missionSuccess, onMissionOutcome, players }) => {
  const [missionResult, setMissionResult] = useState(null);

  const handleMissionOutcome = (result) => {
    setMissionResult(result);
    onMissionOutcome(result);
  };

  return (
    <div className="mission-phase">
      <h2>Fase de Misión</h2>
      <p>Votación sobre si la misión fue exitosa o no</p>

      {missionResult === null ? (
        <div className="outcome-buttons">
          <button onClick={() => handleMissionOutcome(true)}>✅ Misión Exitosa</button>
          <button onClick={() => handleMissionOutcome(false)}>❌ Misión Fallida</button>
        </div>
      ) : (
        <p>Resultado de la misión: {missionResult ? 'Éxito' : 'Fracaso'}</p>
      )}

      <div className="mission-status">
        <h3>Estado de los jugadores:</h3>
        <ul>
          {players.map(player => (
            <li key={player.id}>
              {player.name}: {player.isSpy ? 'Espía' : 'Agente'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MissionPhase;