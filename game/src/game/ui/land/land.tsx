import { ConnectButton } from "@rainbow-me/rainbowkit";
import { gameState } from "../../state/game-state";
import { MintLand } from "./MintLand";

export const Land = () => {
  const currentLand = gameState((s) => s.currentLand);

  return (
    <div className="flex flex-col w-full  items-center pb-4">
      <div className="flex w-full justify-center items-center bg-terminal h-8">
        <p className="text-black text-xl">
          Land #{currentLand?.id} ( {currentLand?.x}, {currentLand?.y} )
        </p>
      </div>
      <p className="text-white mt-4">
        {" "}
        Some cool text <br />{" "}
      </p>
      <ConnectButton />
      {currentLand ? <MintLand land={currentLand} /> : <></>}
    </div>
  );
};
