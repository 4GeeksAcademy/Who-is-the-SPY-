import React, { useState } from 'react';

const TeamProposal = ({ players, missionSize, onSubmit, currentUserId, leaderId }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((pid) => pid !== id));
    } else if (selectedIds.length < missionSize) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSubmit = () => {
    if (selectedIds.length === missionSize) {
      onSubmit(selectedIds);
    } else {
      alert(`Debes seleccionar exactamente ${missionSize} agentes.`);
    }
  };

  if (currentUserId !== leaderId) {
    const leaderName = players.find(p => p.id === leaderId)?.name || 'Líder';
    return <p>Esperando que <strong>{leaderName}</strong> elija al equipo...</p>;
  }

  return (
    <div className="team-proposal">
      <h2>Selecciona {missionSize} agentes para la misión</h2>
      <ul className="player-list">
        {players.map((player) => (
          <li
            key={player.id}
            className={selectedIds.includes(player.id) ? 'selected' : ''}
            onClick={() => toggleSelect(player.id)}
          >
            <img src={player.avatar} alt={player.name} />
            <span>{player.name}</span>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Proponer equipo</button>
    </div>
  );
};

export default TeamProposal;