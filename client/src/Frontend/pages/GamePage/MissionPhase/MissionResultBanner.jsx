import React from 'react';

const MissionResultBanner = ({ result }) => {
  const messages = {
    success: '✅ Éxito en la misión',
    fail: '❌ Sabotaje detectado',
    corrupted: '⚠️ Misión corrupta (faltaron votos)',
    denied: '🚫 Misión denegada',
  };

  return (
    <div className="mission-result">
      <h3>{messages[result] || 'Resultado desconocido'}</h3>
    </div>
  );
};

export default MissionResultBanner;