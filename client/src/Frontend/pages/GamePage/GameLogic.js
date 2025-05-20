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
    role: 'agent',  // Inicialmente todos son agentes
    vote: null,
    isLeader: false,
  }));

  // Asignar espías de manera aleatoria
  const shuffled = shuffleArray(players);
  for (let i = 0; i < settings.spyCount; i++) {
    shuffled[i].role = 'spy';  // Los primeros 'spyCount' jugadores serán espías
  }

  // Crear configuración de las misiones (con 2 o 3 agentes por misión)
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
  };
};

// Generar tamaño de misiones basado en el número de jugadores
function generateMissionSizes(playerCount) {
  // Siempre 5 rondas, al menos 2 con 3 agentes en la misión
  let base = [2, 2, 2, 3, 3];
  return shuffleArray(base);
}

// El líder propone un equipo para una misión
export const proposeMissionTeam = (gameState, selectedPlayerIds) => {
  const missionSize = gameState.missionSizes[gameState.round - 1];
  
  // Verificar si el número de jugadores seleccionados es el correcto
  if (selectedPlayerIds.length !== missionSize) return null;

  return {
    ...gameState,
    currentMission: {
      team: selectedPlayerIds,
      approved: null,
      result: null,
      votes: {},
    },
    voteInProgress: true,  // Iniciar fase de votación
  };
};

// Jugadores votan para aprobar o rechazar el equipo
export const castVote = (gameState, playerId, vote) => {
  if (!gameState.voteInProgress) return gameState;

  const updatedVotes = {
    ...gameState.currentMission.votes,
    [playerId]: vote,
  };

  const totalVotes = Object.keys(updatedVotes).length;

  // Si todos los jugadores han votado, resolver la votación
  if (totalVotes === gameState.players.length) {
    const approvals = Object.values(updatedVotes).filter(v => v === true).length;
    const approved = approvals > gameState.players.length / 2;

    return {
      ...gameState,
      currentMission: {
        ...gameState.currentMission,
        approved,
        votes: updatedVotes,
      },
      voteInProgress: false,  // Terminar la fase de votación
      missionInProgress: approved,  // Si se aprobó, la misión inicia
      currentLeaderIndex: getNextLeaderIndex(gameState),  // El siguiente líder
    };
  }

  return {
    ...gameState,
    currentMission: {
      ...gameState.currentMission,
      votes: updatedVotes,
    },
  };
};

// Resolver la misión dependiendo de los votos de los jugadores
export const resolveMission = (gameState, missionVotes) => {
  if (!gameState.missionInProgress) return gameState;

  const fails = missionVotes.filter(v => v === 'fail').length;
  const success = fails === 0;

  const updatedMission = {
    ...gameState.currentMission,
    result: success ? 'success' : 'fail',
  };

  return {
    ...gameState,
    missionInProgress: false,
    round: gameState.round + 1,  // Avanzar a la siguiente ronda
    missionHistory: [...gameState.missionHistory, updatedMission],
    currentMission: null,
  };
};

// Obtener el siguiente líder para elegir el equipo
function getNextLeaderIndex(gameState) {
  return (gameState.currentLeaderIndex + 1) % gameState.players.length;
}