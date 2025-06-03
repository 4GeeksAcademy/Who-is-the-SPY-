import { useState, useEffect } from 'react';
import { getDatabase, ref, set, push } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import './CreateRoom.css';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) setUser(firebaseUser);
      else alert('Debes iniciar sesión para crear una sala.');
    });

    return () => unsubscribe();
  }, []);

  const handleCreateRoom = async () => {
    if (!user) {
      alert('Usuario no autenticado.');
      return;
    }

    const db = getDatabase();
    const newRoomRef = push(ref(db, 'rooms/'));
    const newRoomId = newRoomRef.key;

    const baseUrl = window.location.origin;
    const fullInviteLink = `${baseUrl}/invite/${newRoomId}`;

    const roomData = {
      gameStarted: false,
      host: user.uid,
      players: {
        [user.uid]: {
          name: user.displayName || 'Anfitrión',
          status: 'ready',
        },
      },
      settings: {
        mode: 'normal',
      },
      inviteLink: fullInviteLink,
      roomName: roomName || 'Sala sin nombre',
    };

    await set(newRoomRef, roomData);
    navigate(`/room/${newRoomId}`);
  };

  const handleGoToJoin = () => {
    navigate('/join');
  };

  const handleGoBack = () => {
    navigate(-1); // Vuelve a la página anterior
  };

  return (
    <><button className="go-back-button" onClick={handleGoBack}>
          Volver atrás
        </button>
      <div className="create-room">
        <h2>Crear nueva Sala</h2>
        <input
          type="text"
          placeholder="Nombre de la sala (opcional)"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button onClick={handleCreateRoom}>Crear Sala</button>
      </div>

      <div className="join-room-section">
        <button className="join-room-button" onClick={handleGoToJoin}>
          Join Room
        </button>
        
      </div>
    </>
  );
};

export default CreateRoom;