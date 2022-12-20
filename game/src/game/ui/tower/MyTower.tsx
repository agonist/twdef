import Image from "next/image";
import { useAccount, useContractReads } from "wagmi";
import { TowerzAbi } from "../../../abi/Towerz";
import { Contracts } from "../../../web3/Contracts";
import { userState } from "../../state/user-state";
import { StackLandAndTower } from "../stack/StackLandAndTower";

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
          <div
            key={l}
            className="flex-shrink-0 card card-compact mb-4 bg-base-100 shadow-md shadow-pinkz "
          >
            <figure>
              <Image src={"/firetower.jpeg"} width={130} height={130} />
            </figure>
            <div className="flex flex-col p-2">
              <h2 className="card-title text-pinkz">🔥Tower #{l}</h2>
              <p className="text-yellow-200">⚔️25 🌪️12</p>
              <div className="card-actions justify-center pt-2">
                <StackLandAndTower
                  landId={landId}
                  towerId={l}
                  successCallback={() => {
                    successCallback?.();
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
