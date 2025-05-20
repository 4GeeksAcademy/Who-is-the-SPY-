function getConspiratorCount(playerCount) {
  if (playerCount <= 5) return 1;
  if (playerCount <= 7) return 2;
  if (playerCount <= 9) return 2;
  if (playerCount <= 12) return 3;
  if (playerCount <= 15) return Math.min(5, Math.floor(playerCount / 3));
  return 1; // default fallback
}