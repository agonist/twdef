import Image from "next/image";
import { useAccount, useContractReads } from "wagmi";
import { TowerzAbi } from "../../../abi/Towerz";
import { Contracts } from "../../../web3/Contracts";
import { StackLandAndTower } from "../stack/StackLandAndTower";

interface LandId {
  landId: number;
}

export const MyTowers = ({ landId }: LandId) => {
  const { address } = useAccount();

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
    <div className="overflow-x-scroll">
      <div className="flex">
        {data?.[0].map((l) => (
          <div key={l.toNumber()} className="flex-shrink-0 bg-neutral">
            <div className="flex flex-col space-y-4  items-start">
              <div className="flex space-x-2">
                <Image src={"/land.png"} width={100} height={100} />
                <div className="flex flex-col space-y-2">
                  <p className="my-1 font-bold text-xl">
                    Tower #{l.toNumber()}
                  </p>
                  <p className="my-1">Lvl: 1 - dmg: 27</p>

                  <StackLandAndTower landId={landId} towerId={l.toNumber()} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
