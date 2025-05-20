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

  const extractRoomId = (url) => {
    try {
      const parts = url.trim().split("/");
      return parts[parts.length - 1]; // Ej: https://tuweb.com/invite/abc123 → abc123
    } catch {
      return null;
    }
  };

  const handleJoinLink = () => {
    const roomId = extractRoomId(inviteLink);
    if (!roomId) {
      alert("Link de invitación no válido");
      return;
    }

    if (user) {
      // Usuario logueado → va directo a join-room
      navigate(`/join-room/${roomId}`);
    } else {
      // Usuario no logueado → guarda link y redirige al login
      localStorage.setItem("pendingInviteLink", inviteLink);
      navigate("/login");
    }
  };

  return (
    <div className="home-container inicio">
      <h1>Te esperábamos</h1>

      {user ? (
        <>
          <p>Agente {user.email}</p>

          <button className="btn mystery-button" onClick={() => navigate("/create-room")}>
            Crear Sala
          </button>

          <button className="btn mystery-button" onClick={handleLogout}>
            Cerrar sesión
          </button>

          <div className="join-room-section">
            <h3>¿Tienes un link de invitación?</h3>
            <input
              type="text"
              placeholder="Pega el link aquí"
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
            />
            <button className="btn mystery-button" onClick={handleJoinLink}>
              Unirse a la sala
            </button>
          </div>
        </>
      ) : (
        <>
          <button className="btn mystery-button" onClick={() => navigate("/login")}>
            Inicia sesión
          </button>
          <button className="btn mystery-button" onClick={() => navigate("/register")}>
            Regístrate
          </button>

          <div className="join-room-section">
            <h3>¿Tienes un link de invitación?</h3>
            <input
              type="text"
              placeholder="Pega el link aquí"
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
            />
            <button className="btn mystery-button" onClick={handleJoinLink}>
              Unirse a la sala
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;