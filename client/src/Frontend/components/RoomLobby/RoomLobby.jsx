import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { auth } from '../../firebase';

const RoomLobby = () => {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [userStatus, setUserStatus] = useState('waiting');
  const [userId, setUserId] = useState('');
  const [voteTime, setVoteTime] = useState(12);
  const [spyCount, setSpyCount] = useState(1);
  const [missionPrepTime, setMissionPrepTime] = useState(20);
  const [allPlayersReady, setAllPlayersReady] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  useEffect(() => {
    const db = getDatabase();
    const roomRef = ref(db, 'rooms/' + roomId);

    onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setRoomData(data);
        setInviteLink(data.inviteLink || `${window.location.origin}/room/${roomId}`);

        const playersReady = Object.values(data.players || {}).every(player => player.status === 'ready');
        setAllPlayersReady(playersReady);
      } else {
        alert('Sala no encontrada.');
      }
    });

    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    }
  }, [roomId]);

  const handleReady = () => {
    if (!userId || !roomData) return;

    const db = getDatabase();
    const playerRef = ref(db, `rooms/${roomId}/players/${userId}`);
    update(playerRef, { status: 'ready' });
    setUserStatus('ready');
  };

  const handleStartGame = () => {
    if (userId !== roomData.host) return;

    const db = getDatabase();
    const roomRef = ref(db, `rooms/${roomId}`);
    update(roomRef, {
      gameStarted: true,
      settings: {
        voteTime,
        spyCount,
        missionPrepTime
      }
    });
  };

  const isHost = roomData && roomData.host === userId;

  return (
    <div className="room-lobby">
      {roomData ? (
        <>
          <h2>Sala: {roomId}</h2>
          <p><strong>Enlace de invitación:</strong></p>
          <input type="text" readOnly value={inviteLink} onClick={(e) => e.target.select()} />

          <h3>Jugadores:</h3>
          <ul>
            {Object.entries(roomData.players).map(([key, player]) => (
              <li key={key}>{player.name} - {player.status}</li>
            ))}
          </ul>

          {!isHost && userStatus === 'waiting' && (
            <button onClick={handleReady}>Estoy listo</button>
          )}
          {!isHost && userStatus === 'ready' && (
            <p>Esperando a los demás...</p>
          )}

          {isHost && (
            <>
              <div className="host-dashboard">
                <h3>Configuración del juego</h3>

                <label>Tiempo de Votación (5-15s):</label>
                <input
                  type="number"
                  value={voteTime}
                  min="5"
                  max="15"
                  onChange={(e) => setVoteTime(Number(e.target.value))}
                />

                <label>Número de Espías (1-5):</label>
                <input
                  type="number"
                  value={spyCount}
                  min="1"
                  max="5"
                  onChange={(e) => setSpyCount(Number(e.target.value))}
                />

                <label>Tiempo para Preparar Misión (20s, 40s, 60s):</label>
                <select
                  value={missionPrepTime}
                  onChange={(e) => setMissionPrepTime(Number(e.target.value))}
                >
                  <option value={20}>20 segundos</option>
                  <option value={40}>40 segundos</option>
                  <option value={60}>60 segundos</option>
                </select>
              </div>

              {allPlayersReady ? (
                <button onClick={handleStartGame}>Iniciar Juego</button>
              ) : (
                <p>Esperando a que todos los jugadores estén listos...</p>
              )}
            </>
          )}
        </>
      ) : (
        <p>Cargando sala...</p>
      )}
    </div>
  );
};

export default RoomLobby;