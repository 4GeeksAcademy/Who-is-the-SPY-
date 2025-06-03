import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { logoutUser } from "../../services/authService";
import './home.css';

const Home = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [inviteLink, setInviteLink] = useState("");

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const extractRoomId = (input) => {
    try {
      const url = new URL(input);
      const paths = url.pathname.split("/");
      return paths[paths.length - 1]; // Extrae el último segmento del path
    } catch {
      return input.trim(); // Si no es una URL, asumimos que es solo el ID
    }
  };

  const handleJoinLink = () => {
    const roomId = extractRoomId(inviteLink);

    if (!roomId) {
      alert("Link o código de invitación no válido");
      return;
    }

    navigate(`/room/${roomId}`);
  };

  return (
    <div className="home-container inicio">
      <h1>Te esperábamos</h1>

      {user ? (
        <>
          <p>Agente {user.email}</p>

          <button className="btn mystery-button" onClick={() => navigate("/create")}>
            Crear Sala
          </button>

          <button className="btn mystery-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <button className="btn mystery-button" onClick={() => navigate("/login")}>
            Inicia sesión
          </button>
          <button className="btn mystery-button" onClick={() => navigate("/register")}>
            Regístrate
          </button>
        </>
      )}

      <div className="join-room-section">
        <h3>¿Tienes un link o código de invitación?</h3>
        <input
          type="text"
          placeholder="Pega el link o código aquí"
          value={inviteLink}
          onChange={(e) => setInviteLink(e.target.value)}
        />
        <button className="btn mystery-button" onClick={handleJoinLink}>
          Unirse a la sala
        </button>
      </div>
    </div>
  );
};

export default Home;