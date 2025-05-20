import { useState } from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const CreateRoom = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const db = getDatabase();
    const newRoomId = `room${Math.floor(Math.random() * 10000)}`;
    set(ref(db, 'rooms/' + newRoomId), {
      gameStarted: false,
      players: {
        [`player${Math.floor(Math.random() * 1000)}`]: { name: 'Jugador 1', status: 'ready' }
      }
    });
    navigate(`/room/${newRoomId}`);
  };

  return (
    <div className="create-room">
      <button onClick={handleCreateRoom}>Crear Sala</button>
    </div>
  );
};

export default CreateRoom;