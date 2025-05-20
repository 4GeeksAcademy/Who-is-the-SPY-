import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { getDatabase, ref, onValue } from "firebase/database";
import './WaitingRoomPage.css';

const WaitingRoomPage = () => {
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false); // Para verificar si el juego ya ha comenzado
  const [isHost, setIsHost] = useState(false);
  const navigate = useNavigate();

  // Suponiendo que el ID de la sala se pasa a través de la URL (ejemplo: /waiting-room/:roomId)
  const roomId = "123"; // Cambia esto para que sea dinámico

  // Obtener la lista de jugadores de la base de datos de Firebase
  useEffect(() => {
    const db = getDatabase();
    const roomRef = ref(db, `rooms/${roomId}/players`);
    
    onValue(roomRef, (snapshot) => {
      const playersData = snapshot.val();
      if (playersData) {
        setPlayers(Object.values(playersData));
      }
    });

    // Verificar si el usuario actual es el anfitrión
    if (auth.currentUser && auth.currentUser.email === "host@example.com") {  // Usa el correo o ID del anfitrión
      setIsHost(true);
    }
  }, [roomId]);

  const startGame = () => {
    // Lógica para iniciar el juego, cambiar el estado en la base de datos
    const db = getDatabase();
    const roomRef = ref(db, `rooms/${roomId}`);
    
    // Actualizar el estado del juego a "iniciado"
    roomRef.update({ gameStarted: true });

    setGameStarted(true);
    navigate("/game"); // Redirige a la página de juego
  };

  return (
    <div>
      <h2>Sala de Espera</h2>
      <div>
        <h3>Jugadores:</h3>
        <ul>
          {players.map((player, index) => (
            <li key={index}>{player.name}</li>
          ))}
        </ul>
        {isHost && !gameStarted && (
          <button onClick={startGame}>Iniciar Juego</button>
        )}
        {gameStarted && <p>El juego ha comenzado. ¡Diviértete!</p>}
      </div>
    </div>
  );
};

export default WaitingRoomPage;