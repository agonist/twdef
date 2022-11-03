import { useEffect } from "react";
import { gameState } from "../state/game-state";
import { Land } from "./land/Land";

export const SidePanel = () => {
  const _gameState = gameState();

  useEffect(() => {
    //_gameState.init();
  }, []);

  return (
    <div className="w-3/12 bg-gray-900">
      <div className="flex flex-col items-center py-6 space-y-3">
        <p className="text-green-400 text-xl">TOWER FARMER V1.0</p>
        <Land />
      </div>
    </div>
  );
};
