import { useState } from 'react';
import { getDatabase, ref, set, push } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();
  const user = auth.currentUser; // Obtén el usuario autenticado (anfitrión)

  const handleCreateRoom = () => {
    const db = getDatabase();

    // Crear un nuevo ID de sala utilizando push para generar una clave única
    const newRoomRef = push(ref(db, 'rooms/'));
    const newRoomId = newRoomRef.key;  // Este es el ID único generado por Firebase

    // Datos de la sala, incluyendo el anfitrión
    const roomData = {
      gameStarted: false,
      host: user.uid,  // Usar el ID del usuario autenticado como anfitrión
      players: {
        [user.uid]: { name: user.displayName || "Anfitrión", status: 'ready' },  // Añadir el anfitrión como jugador
      },
      settings: {
        mode: 'normal',  // Puedes establecer un modo predeterminado si es necesario
      },
      inviteLink: `https://tuweb.com/invite/${newRoomId}`  // Enlace de invitación
    };

    // Establecer la información de la sala en la base de datos
    set(newRoomRef, roomData);

    // Redirigir al anfitrión a la página de la lobby
    navigate(`/room/${newRoomId}`);
  };

  return (
    <div className="create-room">
      <h2>Crear nueva Sala</h2>
      <input
        type="text"
        placeholder="Nombre de la sala"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button onClick={handleCreateRoom}>Crear Sala</button>
    </div>
  );
};

export default CreateRoom;