import { useEffect, useRef } from "react";
import { useGame } from "./helpers/useGame";
import { gameConfig } from "./game-config";
import { SidePanel } from "./ui/side-panel";
import { gameState } from "./state/game-state";
import Image from "next/image";

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
    <div className="relative flex-col min-w-screen  h-screen overflow-hidden">
      <div className="flex flex-row items-center  pl-4 py-1 bg-dbg">
        <Image src={"/towerz.png"} width={200} height={46} />

        <button className="btn btn-sm gap-2 ml-36 text-pinkz">
          WAVE
          <div className="badge badge-secondary">{g.currentWave}</div>
        </button>

        <button className="btn btn-sm gap-2 ml-4 text-pinkz">
          Multiplier
          <div className="badge badge-secondary">x{g.currentMultiplier}</div>
        </button>

        {/*        
        <button onClick={() => g.prevMap(game!)}>⬅️</button>
        <p>map_{g.currentMap}</p>
        <button onClick={() => g.nextMap(game!)}>➡️</button>
         */}
      </div>

      <div className="flex h-screen">
        <SidePanel />

        <div className="flex-1">
          <div ref={parentEl} />
        </div>
      </div>
    </div>
  );
};

export default PhaserGame;
