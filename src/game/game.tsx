import { useEffect, useRef } from "react";
import { useGame } from "../helpers/useGame";
import { Types } from "phaser";
import { MainScene } from "./scenes/mainScene";
import { gameState } from "./state/game-state";

const gameConfig: Types.Core.GameConfig = {
  width: "100%",
  height: "100%",
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: false,
  },
  scene: MainScene,
};

// you can place this in a different file if you prefer
const PhaserGame = () => {
  const parentEl = useRef<HTMLDivElement>(null);
  useGame(gameConfig, parentEl);

  const setColor = gameState((s) => s.selectColor);
  const _gameState = gameState();

  useEffect(() => {
    _gameState.init();
  }, []);

  return (
    <div className="container flex min-h-screen w-screen">
      <div className="w-3/12 bg-gray-900">
        <div className="flex flex-col items-center py-6">
          <p className="text-white text-xl">Web3 Tower</p>
          <p className="text-white">GM From NextJs + Tailwind</p>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setColor(0x0000ff);
            }}
          >
            BLUE
          </button>

          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setColor(0xff0000);
            }}
          >
            RED
          </button>

          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setColor(0x00ff00);
            }}
          >
            GREEN
          </button>
        </div>
      </div>

      <div className="flex-1" ref={parentEl} />
    </div>
  );
};

export default PhaserGame;
