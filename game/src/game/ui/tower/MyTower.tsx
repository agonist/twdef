import Image from "next/image";
import { useAccount, useContractReads } from "wagmi";
import { TowerzAbi } from "../../../abi/Towerz";
import { Contracts } from "../../../web3/Contracts";
import { userState } from "../../state/user-state";
import { StackLandAndTower } from "../stack/StackLandAndTower";

interface LandId {
  landId: number;
}

export const MyTowers = ({ landId }: LandId) => {
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
    <div className="overflow-x-scroll pt-4">
      <div className="flex space-x-4">
        {user.towersBalanceByIds.map((l) => (
          <div
            key={l}
            className="card card-compact bg-base-100 shadow-xl flex-shrink-0"
          >
            <figure>
              <Image src={"/firetower.jpeg"} width={150} height={150} />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Tower #{l}</h2>
              <p>Click the button</p>
              <div className="card-actions justify-end">
                <StackLandAndTower landId={landId} towerId={l} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
