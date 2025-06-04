// Función para barajar un array de forma aleatoria
function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

// Inicializar el juego con la configuración y jugadores
export const initializeGame = (settings, playersObj) => {
  const players = Object.entries(playersObj).map(([id, player]) => ({
    id,
    name: player.name,
    avatar: player.avatar || `https://api.dicebear.com/7.x/thumbs/svg?seed=${player.name}`,
    role: 'agent',
    vote: null,
    isLeader: false,
  }));

  const shuffled = shuffleArray(players);
  for (let i = 0; i < settings.spyCount; i++) {
    shuffled[i].role = 'spy';
  }

  const missionSizes = generateMissionSizes(players.length);

  return {
    round: 1,
    voteTime: settings.voteTime,
    missionPrepTime: settings.missionPrepTime,
    missionSizes,
    players: shuffled,
    currentLeaderIndex: 0,
    currentMission: null,
    missionHistory: [],
    voteInProgress: false,
    missionInProgress: false,
    failedMissions: 0,
    corruptedMissions: 0,
    deniedMissions: 0,
    spiesScore: 0,
    agentsScore: 0,
  };
};

function generateMissionSizes(playerCount) {
  let base = [2, 2, 2, 3, 3]; // Puedes ajustar esta lógica según cantidad real
  return shuffleArray(base);
}

// Lógica para proponer un equipo de misión
export const proposeMissionTeam = (gameState, selectedPlayerIds) => {
  const missionSize = gameState.missionSizes[gameState.round - 1];

  if (selectedPlayerIds.length !== missionSize) return null;

  return {
    ...gameState,
    currentMission: {
      team: selectedPlayerIds,
      approved: null,
      result: null,
      votes: {},
    },
    voteInProgress: true,
  };
};

// Votos de aprobación o rechazo del equipo (previo a misión)
export const castVote = (gameState, playerId, vote) => {
  if (!gameState.voteInProgress) return gameState;

  const updatedVotes = {
    ...gameState.currentMission.votes,
    [playerId]: vote,
  };

  const totalVotes = Object.keys(updatedVotes).length;

  if (totalVotes === gameState.players.length) {
    const approvals = Object.values(updatedVotes).filter(v => v === true).length;
    const approved = approvals > gameState.players.length / 2;

    let newState = {
      ...gameState,
      currentMission: {
        ...gameState.currentMission,
        approved,
        votes: updatedVotes,
      },
      voteInProgress: false,
      missionInProgress: approved,
      currentLeaderIndex: getNextLeaderIndex(gameState),
    };

    if (!approved) {
      newState.deniedMissions += 1;

      if (newState.deniedMissions % 2 === 0) {
        newState.spiesScore += 1;
      }

      newState.missionHistory.push({
        result: 'denied',
        color: 'dark-yellow',
        round: gameState.round,
      });

      newState.round += 1;
    }

    return newState;
  }

  return {
    ...gameState,
    currentMission: {
      ...gameState.currentMission,
      votes: updatedVotes,
    },
  };
};

// 🔥 NUEVO: Votos de misión (éxito o sabotaje)
export const castMissionVote = (gameState, playerId, vote) => {
  if (!gameState.missionInProgress) return gameState;

  // Solo jugadores en la misión pueden votar
  if (!gameState.currentMission.team.includes(playerId)) return gameState;

  const updatedVotes = {
    ...gameState.currentMission.votes,
    [playerId]: vote,
  };

  return {
    ...gameState,
    currentMission: {
      ...gameState.currentMission,
      votes: updatedVotes,
    },
  };
};

// Resolver el resultado de la misión
export const resolveMission = (gameState, missionVotesObj) => {
  if (!gameState.missionInProgress) return gameState;

  const team = gameState.currentMission.team;
  const missionVotes = team.map(playerId => missionVotesObj[playerId]).filter(Boolean);

  const fails = missionVotes.filter(v => v === 'fail').length;
  const missingVotes = missionVotes.length < team.length;

  let result = 'success';
  let color = 'green';
  let newGameState = { ...gameState };

  if (missingVotes) {
    newGameState.corruptedMissions += 1;
    if (newGameState.corruptedMissions % 2 === 0) {
      newGameState.spiesScore += 1;
    }
    result = 'corrupted';
    color = 'yellow';
  } else if (fails > 0) {
    newGameState.failedMissions += 1;
    newGameState.spiesScore += 1;
    result = 'fail';
    color = 'red';
  } else {
    newGameState.agentsScore += 1;
  }

  newGameState.missionHistory.push({
    team,
    result,
    color,
    round: gameState.round,
  });

  return {
    ...newGameState,
    missionInProgress: false,
    round: gameState.round + 1,
    currentMission: null,
  };
};

function getNextLeaderIndex(gameState) {
  return (gameState.currentLeaderIndex + 1) % gameState.players.length;
}