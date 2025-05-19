import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const GamePage = () => {
  const [gameState, setGameState] = useState("Esperando jugadores");
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
    }
    // Aquí se podría configurar un sistema de juego en tiempo real con Firebase o algo similar
    // En este ejemplo se simula el estado del juego
    setPlayers(["Jugador1", "Jugador2", "Jugador3", "Anfitrión"]);
  }, [navigate]);

  const handleMissionStart = () => {
    setGameState("Misión en curso...");
    // Lógica para iniciar una misión
  };

  return (
    <div>
      <h2>Juego en curso</h2>
      <p>Estado del juego: {gameState}</p>
      <p>Jugadores:</p>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
      <button onClick={handleMissionStart}>Iniciar Misión</button>
    </div>
  );
};

export default GamePage;