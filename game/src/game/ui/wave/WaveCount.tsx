import { gameState } from "../../state/game-state";

export const WaveCount = () => {
  const waveCount = gameState((s) => s.currentWave);
  return <p>Wave: {waveCount}</p>;
};
