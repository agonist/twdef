import { useQuery, useQueryClient } from "react-query";
import { fetchTowerInfo } from "../../api/api";
import { TowerData } from "./MyTowerItem";
import { LandTowerPair } from "../stack/StackLandAndTower";
import Image from "next/image";
import { StackLandAndTower } from "../stack/StackLandAndTower";
import { TowerTitle } from "./TowerTitle";
import { TowerBonus } from "./TowerBonus";

export const TowerToBuild = ({
  landId,
  towerId,
  successCallback,
}: LandTowerPair) => {
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

  return (
    <div className="flex-shrink-0 card card-compact mb-4 bg-base-100 shadow-md shadow-pinkz ">
      <figure>
        <Image src={"/firetower.jpeg"} width={150} height={150} />
      </figure>
      <div className="flex flex-col p-2">
        <TowerTitle tower={data!} />
        <TowerBonus tower={data!} />
        <div className="card-actions justify-center pt-2">
          <StackLandAndTower
            landId={landId}
            towerId={towerId}
            successCallback={() => {
              successCallback?.();
            }}
          />
        </div>
      </div>
    </div>
  );
};
