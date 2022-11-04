import { gameState } from "../state/game-state";
import { LandSection } from "./land/LandSection";

export const SidePanel = () => {
  return (
    <div className="w-3/12 bg-base-300 prose">
      <div className="flex flex-col items-center space-y-3">
        <h3 className="text-accent">TOWER FARMER V1.0 (👩‍🌾, 🏰)</h3>
        <FirstSection />
      </div>
    </div>
  );
};

export const FirstSection = () => {
  const _gameState = gameState();

  if (_gameState.currentLand === undefined) {
    return (
      <p className="text-white text-center">
        Select a cell on the map and chose what you want to do
      </p>
    );
  }

  if (_gameState.currentLand) {
    return <LandSection land={_gameState.currentLand} />;
  }

  return <></>;
};
