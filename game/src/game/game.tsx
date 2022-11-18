import { useEffect, useRef } from "react";
import { useGame } from "./helpers/useGame";
import { gameConfig } from "./game-config";
import { SidePanel } from "./ui/side-panel";
import { gameState } from "./state/game-state";

// Game Root component
const PhaserGame = () => {
  const parentEl = useRef<HTMLDivElement>(null);
  const game = useGame(gameConfig, parentEl);
  const init = gameState((s) => s.init);

  useEffect(() => {
    if (game !== undefined) {
      console.log(game);
      // init(game);
    }
  }, [game]);

  return (
    <div className="relative flex min-w-screen  h-screen overflow-hidden">
      <SidePanel />

      <div className="flex-1" ref={parentEl} />
    </div>
  );
};

export default PhaserGame;
