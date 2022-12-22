import { useAccount, useContractReads } from "wagmi";
import { TowerzAbi } from "../../../abi/Towerz";
import { Contracts } from "../../../web3/Contracts";
import { userState } from "../../state/user-state";
import { MyTowerItem } from "./MyTowerItem";

export const MyTowersInventory = () => {
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

  if (isError) {
    return <></>;
  }

  return (
    <div className="flex flex-col w-11/12 pt-4 space-y-4">
      {user.towersBalanceByIds.map((l) => (
        <MyTowerItem towerId={l} key={l} />
      ))}
    </div>
  );
};
