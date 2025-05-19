import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);  // Estado para manejar la carga
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);  // Comienza el proceso de carga
    setError("");  // Limpiar errores anteriores

    try {
      // Login con Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // Obtener el ID Token (JWT) de Firebase
      const user = auth.currentUser;
      const idToken = await user.getIdToken();
      console.log("ID Token:", idToken); // Guardarlo en localStorage o sesión si lo necesitas

      // Redirigir al home (sala de espera)
      navigate("/waiting-room");
    } catch (err) {
      setError("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);  // Termina el proceso de carga
    }
  };

  return (
    <div>
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
        <button type="submit" disabled={loading}>Iniciar sesión</button>
        {loading && <p>Cargando...</p>} {/* Mensaje de carga */}
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Mostrar error */}
      </form>
    </div>
  );
};

export default Login;