import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, onValue, update } from 'firebase/database';

const RoomLobby = () => {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [userStatus, setUserStatus] = useState('waiting');

  useEffect(() => {
    const db = getDatabase();
    const roomRef = ref(db, 'rooms/' + roomId);
    onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        setRoomData(snapshot.val());
      } else {
        alert('Sala no encontrada.');
      }
    });
  }, [roomId]);

  const handleReady = () => {
    const db = getDatabase();
    const roomRef = ref(db, 'rooms/' + roomId + '/players/player1');
    update(roomRef, { status: 'ready' });
    setUserStatus('ready');
  };

  const handleStartGame = () => {
    const db = getDatabase();
    const roomRef = ref(db, 'rooms/' + roomId);
    update(roomRef, { gameStarted: true });
  };

  return (
    <div className="room-lobby">
      {roomData ? (
        <>
          <h2>Sala: {roomId}</h2>
          <p>Jugadores:</p>
          <ul>
            {Object.entries(roomData.players).map(([key, player]) => (
              <li key={key}>
                {player.name} - {player.status}
              </li>
            ))}
          </ul>
          {userStatus === 'waiting' ? (
            <button onClick={handleReady}>Estoy listo</button>
          ) : (
            <button onClick={handleStartGame}>Iniciar Juego</button>
          )}
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default RoomLobby;