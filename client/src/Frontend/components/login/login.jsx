import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import './login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);

      const user = auth.currentUser;
      const idToken = await user.getIdToken();
      console.log("ID Token:", idToken);

      const pendingLink = localStorage.getItem("pendingInviteLink");

      if (pendingLink) {
        const roomId = extractRoomId(pendingLink);
        localStorage.removeItem("pendingInviteLink");
        navigate(`/join-room/${roomId}`);
      } else {
        // 🔁 CAMBIO: redirigir al home
        navigate("/home");
      }
    } catch (err) {
      setError("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  const extractRoomId = (url) => {
    try {
      const parts = url.trim().split("/");
      return parts[parts.length - 1];
    } catch {
      return null;
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
    {/* 🔙 Botón para volver */}
    <button onClick={handleGoBack} className="go-back-button">
        Volver atrás
      </button>
    <div className="loginview container">
      <h2>Iniciar sesión</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit" disabled={loading}>
          Iniciar sesión
        </button>
        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      
      
    </div>
    </>
  );
};

export default Login;