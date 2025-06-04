import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./Frontend/services/AuthContext";// Asegúrate que la ruta sea correcta

import Register from "./Frontend/components/Register/Register";
import Login from "./Frontend/components/login/login";
import Home from "./Frontend/pages/home/home";
import GamePage from "./Frontend/pages/GamePage/GamePage";
import JoinRoom from "./Frontend/components/JoinRoom/JoinRoom";
import CreateRoom from "./Frontend/components/CreateRoom/CreateRoom";
import RoomLobby from "./Frontend/components/RoomLobby/RoomLobby";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/game/:roomId" element={<GamePage />} />
          <Route path="/join" element={<JoinRoom />} />
          <Route path="/create" element={<CreateRoom />} />
          <Route path="/room/:roomId" element={<RoomLobby />} />

          {/* Si la ruta no existe, redirige al inicio */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;