import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JoinRoom = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (roomId) {
      navigate(`/room/${roomId}`);
    } else {
      alert('Por favor, ingresa un enlace de sala válido.');
    }
  };

  return (
    <div className="join-room">
      <input
        type="text"
        placeholder="Enlace de sala"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Unirse a Sala</button>
    </div>
  );
};

export default JoinRoom;