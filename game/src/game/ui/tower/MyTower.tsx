import Image from "next/image";
import { useAccount, useContractReads } from "wagmi";
import { TowerzAbi } from "../../../abi/Towerz";
import { Contracts } from "../../../web3/Contracts";

export const MyTowers = () => {
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
    <div className="flex flex-col w-full space-y-4">
      {data?.[0].map((l) => (
        <div key={l.toNumber()} className="w-full bg-neutral">
          <div className="flex flex-col space-y-4  items-start">
            <div className="flex space-x-2">
              <Image src={"/land.png"} width={100} height={100} />
              <div className="flex flex-col space-y-2">
                <p className="my-1 font-bold text-xl">Tower #{l.toNumber()}</p>
                <p className="my-1">Do stuff with my super tower</p>

                <div className="flex space-x-2 pb-2">
                  <button className="btn btn-xs btn-secondary">Sell</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
