import { gameState } from "../state/game-state";
import { uiState } from "../state/ui-state";
import { LandSection } from "./land/LandSection";
import { MyLands } from "./land/MyLands";
import { MyTower } from "./tower/MyTower";

export const SidePanel = () => {
  const currentTab = uiState((s) => s.currentTab);
  const setCurrentTab = uiState((s) => s.setCurrentTab);

  return (
    <div className="w-3/12 bg-base-300 prose  overflow-y-auto ">
      <div className="flex flex-col items-center space-y-3">
        <h3 className="text-accent">TOWER FARMER V1.0 (👩‍🌾, 🏰)</h3>

        <div className="tabs tabs-boxed">
          <a
            className={
              "tab link link-hover " + (currentTab === 0 ? "tab-active" : "")
            }
            onClick={() => setCurrentTab(0)}
          >
            Game
          </a>
          <a
            className={
              "tab link link-hover " + (currentTab === 1 ? "tab-active" : "")
            }
            onClick={() => setCurrentTab(1)}
          >
            My Lands
          </a>
          <a
            className={
              "tab link link-hover " + (currentTab === 2 ? "tab-active" : "")
            }
            onClick={() => setCurrentTab(2)}
          >
            My Towers
          </a>
        </div>

        <SectionSelector currentTab={currentTab} />
      </div>
    </div>
  );
};

interface SectionSelectorProps {
  currentTab: number;
}

export const SectionSelector = ({ currentTab }: SectionSelectorProps) => {
  if (currentTab === 0) {
    return <GameSection />;
  }
  if (currentTab === 1) {
    return <MyLands />;
  }
  if (currentTab === 2) {
    return <MyTower />;
  }
  return <></>;
};

export const GameSection = () => {
  const _gameState = gameState();

  if (_gameState.currentLandId === 0) {
    return (
      <p className="text-white text-center">
        Select a cell on the map and chose what you want to do
      </p>
    );
  }

  if (_gameState.currentLandId > 0) {
    return <LandSection landId={_gameState.currentLandId} />;
  }

  return <></>;
};
