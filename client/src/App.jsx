import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "../firebase";
import Register from "./Frontend/components/Register/Register";
import Login from "./Frontend/components/login/login";
import Home from "./pages/Home";
import LoginPage from "./Frontend/pages/LoginPage";
import WaitingRoomPage from "./Frontend/pages/WaitingRoomPage";
import GamePage from "./Frontend/pages/GamePage";


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





        {/* Si la ruta no existe, redirige al inicio */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
