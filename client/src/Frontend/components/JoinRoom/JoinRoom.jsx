import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinRoom.css';

const JoinRoom = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    let roomId = inputValue.trim();

    if (!roomId) {
      alert('Por favor, ingresa un enlace de sala válido.');
      return;
    }

    try {
      const url = new URL(roomId);
      const paths = url.pathname.split('/');
      roomId = paths[paths.length - 1];
    } catch {
      // No es una URL completa, asumimos que es solo el ID
    }

    if (roomId) {
      navigate(`/room/${roomId}`);
    } else {
      alert('No se pudo determinar el ID de la sala.');
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Regresa a la página anterior
  };

  return (
    <div>
      <button className='btnbackjoin' onClick={handleGoBack} style={{ marginTop: '10px' }}>
        Volver atrás
      </button>
    <div className="join-room">

      <div className='inputlink'>
      <input
        type="text"
        placeholder="Enlace de sala o código"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Unirse a Sala</button></div>
      
    </div>
    </div>
  );
};

export default JoinRoom;