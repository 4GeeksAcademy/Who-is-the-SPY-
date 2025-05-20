import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./Frontend/firebase"; 
import Register from "./Frontend/components/Register/Register";
import Login from "./Frontend/components/login/login";
import Home from "./Frontend/pages/home/home";
import LoginPage from "./Frontend/pages/LoginPage/LoginPage";
import WaitingRoomPage from "./Frontend/pages/WaitingRoomPage/WaitingRoomPage";
import GamePage from "./Frontend/pages/GamePage/GamePage";
import JoinRoom from "./Frontend/components/JoinRoom/JoinRoom";
import CreateRoom from "./Frontend/components/CreateRoom/CreateRoom";
import RoomLobby from "./Frontend/components/RoomLobby/RoomLobby";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/loginpage" element={<LoginPage/>}/>
        <Route path="/waiting-room" element={<WaitingRoomPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/join" element={<JoinRoom/>} />
        <Route path="/create" element={<CreateRoom/>} />
        <Route path="/lobby" element={<RoomLobby/>} />
        


        {/* Si la ruta no existe, redirige al inicio */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
