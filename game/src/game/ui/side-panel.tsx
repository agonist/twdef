import { useAccount } from "wagmi";
import { isLoggedInJWT } from "../helpers/uils";
import { gameState } from "../state/game-state";
import { uiState } from "../state/ui-state";
import { Initializer } from "./Initializer";
import { LandContent } from "./land/LandContent";
import { MyLands } from "./land/MyLands";
import { MyTowers } from "./tower/MyTower";
import { MyTowersInventory } from "./tower/MyTowersInventory";

export const SidePanel = () => {
  const currentTab = uiState((s) => s.currentTab);
  const setCurrentTab = uiState((s) => s.setCurrentTab);
  const { isConnected } = useAccount();

  return (
    <div className="w-3/12 bg-dbg overflow-y-auto ">
      {isConnected && isLoggedInJWT() ? <Initializer /> : <></>}
      <div className="flex flex-col items-center space-y-3 py-4">
        <div className="tabs tabs-boxed bg-neutral">
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
    return <MyTowersInventory />;
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
    return (
      <div className="flex flex-col w-full items-center py-4 ">
        <LandContent landId={_gameState.currentLandId} />
      </div>
    );
  }

  return <></>;
};
