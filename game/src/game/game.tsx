import { useEffect, useRef } from "react";
import { useGame } from "./helpers/useGame";
import { gameConfig } from "./game-config";
import { SidePanel } from "./ui/side-panel";
import { gameState } from "./state/game-state";
import Image from "next/image";
import { PlayerBalance } from "./ui/user/PlayerBalance";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectWalletOr } from "./ui/wallet/ConnectWalletOr";
import { add } from "lodash";
import { isLoggedInJWT } from "./helpers/uils";

// Game Root component
const PhaserGame = () => {
  const parentEl = useRef<HTMLDivElement>(null);
  const game = useGame(gameConfig, parentEl);
  const g = gameState();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect({
    onSuccess(data) {
      console.log("Success", data);
    },
  });

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
          <div className="badge badge-secondary">
            x{g.currentMultiplier.toFixed(2)}
          </div>
        </button>
        {isConnected && isLoggedInJWT() ? (
          <PlayerBalance address={address!} />
        ) : (
          <></>
        )}

        <ConnectWalletOr>
          <div className="dropdown">
            <button className="btn btn-sm gap-2 ml-4 text-pinkz" tabIndex={0}>
              ACC
              <div className="badge badge-secondary">
                {address?.slice(0, 4)}...
                {address?.slice(address.length - 4, address.length)}
              </div>
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <button
                  onClick={() => {
                    localStorage.removeItem("JWT");
                    disconnect();
                  }}
                >
                  logout
                </button>
              </li>
            </ul>
          </div>
        </ConnectWalletOr>

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
