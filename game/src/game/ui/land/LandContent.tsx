import { BigNumber, ethers } from "ethers";
import Image from "next/image";
import { useQuery, useQueryClient } from "react-query";
import { useAccount, useContractReads } from "wagmi";
import { LandAbi } from "../../../abi/Land";
import { Contracts } from "../../../web3/Contracts";
import { fetchLandInfo } from "../../api/api";
import { userState } from "../../state/user-state";
import { gameState } from "../../state/game-state";
import { ApproveOr } from "../ApproveOr";
import { StackedLandTower } from "../stack/StackedLandTower";
import { MyTowers } from "../tower/MyTower";
import { BuyLandItem } from "./BuyLandItem";
import { LandBonusDamage } from "./LandBonusDamage";
import { LandTitle } from "./LandTitle";

export interface LandData {
  id: number;
  name: string;
  image: string;
  type: string;
  damageBonus: number;
  attributes: [{ trait_type: string; value: any }];
}

export interface LandId {
  landId: number;
}

export function getBonusDamage(land: LandData) {
  const l = land.attributes.find((a) => a.trait_type === "Damage Boost");
  return parseInt(l?.value);
}

export function emojiForLandType(land: LandData) {
  const l = land.attributes.find((a) => a.trait_type === "Type");
  switch (l?.value) {
    case "FIRE": {
      return "🔥";
    }
    case "ICE": {
      return "🧊";
    }
    case "JUNGLE": {
      return "🌴";
    }
  }
}

export const LandContent = ({ landId }: LandId) => {
  const { address } = useAccount();
  const user = userState();
  const selectedLandId = gameState(s => s.currentLandId);

  const { data, isError, isLoading, isSuccess, refetch } = useContractReads({
    contracts: [
      {
        address: Contracts.LAND,
        abi: LandAbi,
        functionName: "landInfo",
        args: [BigNumber.from(1), BigNumber.from(landId)],
      },
      {
        address: Contracts.LAND,
        abi: LandAbi,
        functionName: "ownerOf",
        args: [BigNumber.from(landId)],
      },
    ],
    enabled: landId === selectedLandId,
    onSuccess(data) {
      console.log("Success", data);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  const queryClient = useQueryClient();
  const land = useQuery<LandData, Error>(["land", landId], () =>
    fetchLandInfo(landId!)
  );

  if (isLoading && land.isLoading) {
    return <></>;
  }

  if (
    isSuccess &&
    land.isSuccess &&
    data?.[0].minted &&
    data?.[1] === address
  ) {
    return (
      <div className="flex flex-col w-11/12 space-y-6 ">
        <div className="card card-compact card-side bg-base-100 shadow-md shadow-pinkz">
          <figure>
            <Image
              src={land.data?.image!}
              width={130}
              height={130}
              alt={"land img"}
            />
          </figure>

          <div className="flex flex-col pl-2">
            <LandTitle land={land.data} landId={landId} />
            <LandBonusDamage bonus={getBonusDamage(land.data)} />
          </div>
        </div>
        <ApproveOr>
          <MyTowers
            landId={landId!}
            successCallback={() => {
              refetch();
            }}
          />
        </ApproveOr>
      </div>
    );
  }

  if (isSuccess && data?.[0].minted && user.stakedLandTowerByIds.has(landId)) {
    return (
      <StackedLandTower
        landId={landId}
        land={land.data!}
        mintCallback={() => {
          refetch();
        }}
      />

    );
  }

  if (isSuccess && data?.[0].minted && data?.[1] !== address) {
    return (
      <div className=" card flex flex-col w-11/12 bg-base-100 shadow-md shadow-pinkz">
        <figure>
          <Image src={"/land.png"} width={300} height={300} />
          <Image src={"/firetower.jpeg"} width={300} height={300} />
        </figure>

        <div className="flex flex-col p-2">
          <p className="text-pinkz font-bold text-2xl">
            LAND #{landId} + TOWER #{user.stakedLandTowerByIds.get(landId)}
          </p>
          <p>
            owned by{" "}
            <span className="text-sm text-white">
              {data?.[1].substring(0, 20) + "..."}
            </span>
          </p>
          <p>Damage Bonus: </p>
        </div>
      </div>
    );
  }

  if (isSuccess && !data?.[0].minted) {
    return (
      <BuyLandItem
        land={land.data!}
        landId={landId}
        minted={data?.[0].minted}
        mintCallback={() => {
          refetch();
        }}
      />
    );
  }

  return <></>;
};
