import { logoutUser } from "../services/authService";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <div>
      <h1>Bienvenido al juego</h1>
      {user ? (
        <>
          <p>Sesión iniciada como: {user.email}</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </>
      ) : (
        <>
          <button onClick={() => navigate("/login")}>Iniciar sesión</button>
          <button onClick={() => navigate("/register")}>Registrarse</button>
        </>
      )}
    </div>
  );
};

export default Home;