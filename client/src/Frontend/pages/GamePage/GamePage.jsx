import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { auth, rtdb } from '../../firebase'; // Usa rtdb (Realtime Database)
import { initializeGame, proposeMissionTeam, castVote, resolveMission} from './GameLogic';
import TeamProposal from './TeamProposal/TeamProposal';
import MissionPhase from './MissionPhase/MissionPhase';
import VotingPhase from './VotingPhase/VotingPhase';

import './GamePage.css';

const GamePage = () => {
  const { roomId } = useParams();
  const [gameState, setGameState] = useState(null);
  const [userId, setUserId] = useState('');
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    const roomRef = ref(rtdb, 'rooms/' + roomId); // Usar rtdb

    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setRoomData(data);

        const user = auth.currentUser;
        if (user) {
          setUserId(user.uid);
        }

        if (!gameState) {
          const initialGameState = initializeGame(data.settings, data.players);
          setGameState(initialGameState);
        }
      } else {
        alert('Sala no encontrada.');
      }
    });

    return () => unsubscribe(); // Limpieza
  }, [roomId, gameState]);

  const handleNextPhase = () => {
    setGameState((prevState) => ({
      ...prevState,
      round: prevState.round + 1,
      missionInProgress: false,
      currentMission: null,
    }));
  };

  const handleTeamProposal = (selectedIds) => {
    const newState = proposeMissionTeam(gameState, selectedIds);
    setGameState(newState);
  };

  const handleVoteOutcome = (vote) => {
    const newState = castVote(gameState, userId, vote);
    setGameState(newState);
  };

  const handleMissionOutcome = (missionVotes) => {
    const newState = resolveMission(gameState, missionVotes);
    setGameState(newState);
  };

  return (
    <div className="game-page">
      {gameState ? (
        <>
          <h2>Ronda {gameState.round}</h2>

          {gameState.missionInProgress ? (
            <MissionPhase
              missionSuccess={gameState.currentMission?.result}
              onMissionOutcome={handleMissionOutcome}
              players={gameState.players}
              missionTeam={gameState.currentMission?.team || []}
              userId={userId}
            />
          ) : gameState.voteInProgress ? (
            <VotingPhase
              players={gameState.players}
              onVote={handleVoteOutcome}
              votes={gameState.currentMission?.votes || {}}
              userId={userId}
            />
          ) : (
            <TeamProposal
              players={gameState.players}
              missionSize={gameState.missionSizes[gameState.round - 1]}
              onSubmit={handleTeamProposal}
              leaderId={gameState.players[gameState.currentLeaderIndex]?.id}
              userId={userId}
            />
          )}

          <button onClick={handleNextPhase}>Siguiente fase</button>
        </>
      ) : (
        <p>Cargando el juego...</p>
      )}
    </div>
  );
};

export default GamePage;