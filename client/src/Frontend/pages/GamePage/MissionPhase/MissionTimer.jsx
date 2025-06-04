import React, { useEffect, useState } from 'react';

const MissionTimer = ({ duration, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onExpire]);

  return (
    <div className="mission-timer">
      ⏱ Tiempo restante: {timeLeft}s
    </div>
  );
};

export default MissionTimer;