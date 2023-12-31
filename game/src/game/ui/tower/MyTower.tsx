import Image from "next/image";
import { useAccount, useContractReads } from "wagmi";
import { TowerzAbi } from "../../../abi/Towerz";
import { Contracts } from "../../../web3/Contracts";
import { userState } from "../../state/user-state";
import { StackLandAndTower } from "../stack/StackLandAndTower";
import { TowerTitle } from "./TowerTitle";
import { TowerToBuild } from "./TowerToBuild";

interface LandId {
  landId: number;
  successCallback?: () => void;
}

export const MyTowers = ({ landId, successCallback }: LandId) => {
  const { address } = useAccount();
  const user = userState();

  const { data, isError, isLoading, isSuccess, refetch } = useContractReads({
    contracts: [
      {
        address: Contracts.TOWERZ,
        abi: TowerzAbi,
        functionName: "balanceByIdOf",
        args: [address!!],
      },
    ],
    onSuccess(data) {
      const res = data[0].map((n) => n.toNumber());
      user.setTowersBalance(res);
      console.log("Success BALANCE IS ", data);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  if (isLoading) {
    return <></>;
  }

  return (
    <div className="overflow-x-scroll pt-4 ">
      <div className="flex space-x-4">
        {user.towersBalanceByIds.map((l) => (
          <TowerToBuild
            key={l}
            landId={landId}
            towerId={l}
            successCallback={() => successCallback?.()}
          />
        ))}
      </div>
    </div>
  );
};
