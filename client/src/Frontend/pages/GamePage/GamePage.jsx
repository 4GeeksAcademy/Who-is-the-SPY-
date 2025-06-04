import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue, set } from 'firebase/database';
import { auth, rtdb } from '../../firebase';
import { initializeGame, proposeMissionTeam, castVote, resolveMission } from './GameLogic';
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
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) setUserId(user.uid);
    });

    const roomRef = ref(rtdb, `rooms/${roomId}`);
    const unsubscribeRoom = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setRoomData(data);

        const user = auth.currentUser;
        if (user && !data.gameState && data.host === user.uid) {
          const initialGameState = initializeGame(data.settings, data.players);
          const gameRef = ref(rtdb, `rooms/${roomId}/gameState`);
          set(gameRef, initialGameState);
        }
      } else {
        alert('Sala no encontrada.');
      }
    });

    const gameRef = ref(rtdb, `rooms/${roomId}/gameState`);
    const unsubscribeGame = onValue(gameRef, (snapshot) => {
      if (snapshot.exists()) {
        setGameState(snapshot.val());
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeRoom();
      unsubscribeGame();
    };
  }, [roomId]);

  const updateGameStateInDB = (newState) => {
    const gameRef = ref(rtdb, `rooms/${roomId}/gameState`);
    set(gameRef, newState);
  };

  const handleNextPhase = () => {
    if (!gameState) return;
    const newState = {
      ...gameState,
      round: gameState.round + 1,
      missionInProgress: false,
      currentMission: null,
      voteInProgress: false,
    };
    updateGameStateInDB(newState);
  };

  const handleTeamProposal = (selectedIds) => {
    const newState = proposeMissionTeam(gameState, selectedIds);
    if (newState) updateGameStateInDB(newState);
  };

  const handleVoteOutcome = (vote) => {
    const newState = castVote(gameState, userId, vote);
    updateGameStateInDB(newState);

    // Verifica si todos votaron
    const totalVotes = Object.keys(newState.currentMission.votes || {}).length;
    const totalPlayers = newState.players.length;

    if (totalVotes === totalPlayers && newState.voteInProgress === false && newState.missionInProgress === false) {
      // Todos han votado, si el equipo fue aprobado, se inicia misión
      if (newState.currentMission.approved) {
        updateGameStateInDB({
          ...newState,
          missionInProgress: true,
        });
      } else {
        // Misión denegada, ya fue manejado en castVote (avanza ronda)
        updateGameStateInDB(newState);
      }
    }
  };

  const handleMissionOutcome = (missionVotes) => {
    const votesArray = gameState.currentMission.team.map(pid => {
      return missionVotes[pid] || null;
    }).filter(v => v !== null);

    const newState = resolveMission(gameState, missionVotes);
    updateGameStateInDB(newState);
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
              missionTeam={gameState.currentMission?.team || []}
              players={gameState.players}
              currentUserId={userId}
              votes={gameState.currentMission?.votes || {}}
              onVote={handleVoteOutcome}
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