import Image from "next/image";
import { useQuery, useQueryClient } from "react-query";
import { fetchTowerInfo } from "../../api/api";
import { Land } from "../../state/game-state";
import { userState } from "../../state/user-state";
import { LandData } from "../land/LandContent";
import { LandProps } from "../land/LandProps";
import { LandTitle } from "../land/LandTitle";
import { TowerData } from "../tower/MyTowerItem";
import { TowerTitle } from "../tower/TowerTitle";
import { ConnectWalletOr } from "../wallet/ConnectWalletOr";
import { UnstackLandAndTower } from "./UnstackLandAndTower";

export const StackedLandTower = ({ land, landId, mintCallback }: LandProps) => {
  const user = userState();
  const towerId = user.stakedLandTowerByIds.get(landId)!;

  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<TowerData, Error>(
    ["tower", towerId],
    () => fetchTowerInfo(towerId!)
  );

  if (isLoading) {
    return <></>;
  }

  if (isError) {
    return <></>;
  }

  function totalDamage(land: LandData, tower: TowerData) {
    const t = tower.attributes.find((a) => a.trait_type === "Damage");
    const l = land.attributes.find((a) => a.trait_type === "Damage Boost");
    const total = parseInt(t?.value) + parseInt(l?.value);
    return total;
  }

  if (data === undefined || land === undefined) {
    return <></>;
  }

  return (
    <div className=" card flex flex-col w-11/12 bg-base-100 shadow-md shadow-pinkz">
      <figure>
        <Image src={land?.image!} width={300} height={300} alt={"land img"} />
        <Image src={data?.image!} width={300} height={300} alt={"tower img"} />
      </figure>

      <div className="flex flex-col p-2">
        <div className="flex items-center">
          <LandTitle land={land} landId={landId} />
          <p className="text-yellow-200 text-sm"> ---- </p>
          <TowerTitle tower={data!} />
        </div>
        <p className="text-yellow-200 text-sm">
          {totalDamage(land!, data!)} dmg
        </p>
      </div>
      <div className="card-actions justify-start px-2 pb-2">
        <ConnectWalletOr>
          <UnstackLandAndTower
            landId={landId}
            towerId={towerId}
            successCallback={() => {
              mintCallback?.();
            }}
          />
        </ConnectWalletOr>
      </div>
    </div>
  );
};
