import { useEffect, useRef } from "react";
import { useGame } from "./helpers/useGame";
import { gameConfig } from "./game-config";
import { SidePanel } from "./ui/side-panel";
import { gameState } from "./state/game-state";

// Game Root component
const PhaserGame = () => {
  const parentEl = useRef<HTMLDivElement>(null);
  const game = useGame(gameConfig, parentEl);
  const g = gameState();

  useEffect(() => {
    if (game !== undefined) {
      // init(game);
    }
  }, [game]);

  return (
    <div className="relative flex min-w-screen  h-screen overflow-hidden">
      <SidePanel />

      <div className="flex-1">
        <div className="flex flex-row justify-center space-x-4 bg-base-300">
          <button onClick={() => g.prevMap(game!)}>⬅️</button>
          <p>map_{g.currentMap}</p>
          <button onClick={() => g.nextMap(game!)}>➡️</button>
        </div>
        <div ref={parentEl} />
      </div>
    </div>
  );
};

export default PhaserGame;
