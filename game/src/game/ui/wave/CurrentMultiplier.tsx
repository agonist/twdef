import { gameState } from "../../state/game-state";

export const CurrentMultiplier = () => {
  const multiplier = gameState((s) => s.currentMultiplier);
  return <p>x{multiplier}</p>;
};
