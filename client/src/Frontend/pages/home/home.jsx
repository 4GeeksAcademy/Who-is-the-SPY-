import { logoutUser } from "../../services/authService";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import './home.css';  // Asegúrate de importar el archivo CSS

const Home = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <div className="home-container inicio">
      <h1>Te esperabamos</h1>
      {user ? (
        <>
          <p>Agente {user.email}</p>
          <button className="btn mystery-button" onClick={handleLogout}>Cerrar sesión</button>
        </>
      ) : (
        <>
          <button className="btn mystery-button" onClick={() => navigate("/login")}>Inicia sesión</button>
          <button className="btn mystery-button" onClick={() => navigate("/register")}>Registrate</button>
        </>
      )}
    </div>
  );
};

export default Home;