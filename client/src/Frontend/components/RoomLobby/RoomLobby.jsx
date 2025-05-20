import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue, update } from 'firebase/database';
import { auth, rtdb } from '../../firebase'; // ✅ Usamos la base de datos correcta
import './RoomLobby.css';

const RoomLobby = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [userStatus, setUserStatus] = useState('waiting');
  const [userId, setUserId] = useState('');
  const [voteTime, setVoteTime] = useState(12);
  const [spyCount, setSpyCount] = useState(1);
  const [missionPrepTime, setMissionPrepTime] = useState(20);
  const [allPlayersReady, setAllPlayersReady] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const roomRef = ref(rtdb, 'rooms/' + roomId);

    onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setRoomData(data);
        setInviteLink(data.inviteLink || `${window.location.origin}/room/${roomId}`);

        const playersReady = Object.values(data.players || {}).every(
          (player) => player.status === 'ready'
        );
        setAllPlayersReady(playersReady);

        if (data.gameStarted) {
          navigate(`/game/${roomId}`, {
            state: { settings: data.settings, players: data.players },
          });
        }
      } else {
        alert('Sala no encontrada.');
      }
    });

    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    }
  }, [roomId, navigate]);

  const handleReady = () => {
    if (!userId || !roomData) return;
    const playerRef = ref(rtdb, `rooms/${roomId}/players/${userId}`);
    update(playerRef, { status: 'ready' });
    setUserStatus('ready');
  };

  const handleStartGame = () => {
    if (userId !== roomData.host) return;
    const roomRef = ref(rtdb, `rooms/${roomId}`);
    update(roomRef, {
      gameStarted: true,
      settings: {
        voteTime,
        spyCount,
        missionPrepTime,
      },
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isHost = roomData && roomData.host === userId;

  return (
    <div className="room-lobby">
      {roomData ? (
        <>
          <h2>Sala: {roomId}</h2>
          <div className="invite-link-group">
            <input
              type="text"
              readOnly
              value={inviteLink}
              onClick={(e) => e.target.select()}
            />
            <button onClick={handleCopyLink}>
              {copied ? '¡Copiado!' : 'Copiar enlace'}
            </button>
          </div>

          <div className="player-row">
            {Object.entries(roomData.players).map(([key, player]) => {
              const avatarUrl =
                player.avatar || `https://api.dicebear.com/7.x/thumbs/svg?seed=${player.name}`;
              return (
                <div
                  key={key}
                  className={`player-card ${player.status === 'ready' ? 'ready' : ''}`}
                >
                  <img className="avatar" src={avatarUrl} alt={`Avatar de ${player.name}`} />
                  <div className="player-name">
                    {player.name}
                    {player.status === 'ready' && <span className="check"> ✅</span>}
                  </div>
                  {key === userId && player.status !== 'ready' && (
                    <button onClick={handleReady}>Estoy listo</button>
                  )}
                </div>
              );
            })}
          </div>

          {isHost && (
            <div className="host-dashboard">
              <h3>Configuración del juego</h3>
              <p className="subtitle">Reclutando agentes</p>

              <label>Tiempo de Votación (5-15s):</label>
              <div className="control-group">
                <button onClick={() => setVoteTime(Math.max(5, voteTime - 1))}>−</button>
                <span>{voteTime} s</span>
                <button onClick={() => setVoteTime(Math.min(15, voteTime + 1))}>+</button>
              </div>

              <label>Número de Espías (1-5):</label>
              <div className="control-group">
                <button onClick={() => setSpyCount(Math.max(1, spyCount - 1))}>−</button>
                <span>{spyCount}</span>
                <button onClick={() => setSpyCount(Math.min(5, spyCount + 1))}>+</button>
              </div>

              <label>Tiempo para Preparar Misión:</label>
              <div className="control-group">
                <button
                  onClick={() =>
                    setMissionPrepTime((prev) => {
                      const options = [20, 40, 60];
                      const i = options.indexOf(prev);
                      return options[(i + options.length - 1) % options.length];
                    })
                  }
                >
                  ◀
                </button>
                <span>{missionPrepTime} s</span>
                <button
                  onClick={() =>
                    setMissionPrepTime((prev) => {
                      const options = [20, 40, 60];
                      const i = options.indexOf(prev);
                      return options[(i + 1) % options.length];
                    })
                  }
                >
                  ▶
                </button>
              </div>

              {allPlayersReady ? (
                <button onClick={handleStartGame}>Iniciar Juego</button>
              ) : (
                <p>Esperando a que todos los jugadores estén listos...</p>
              )}
            </div>
          )}
        </>
      ) : (
        <p>Cargando sala...</p>
      )}
    </div>
  );
};

export default RoomLobby;