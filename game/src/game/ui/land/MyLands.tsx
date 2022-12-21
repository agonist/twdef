import Image from "next/image";
import { useAccount, useContractReads } from "wagmi";
import { LandAbi } from "../../../abi/Land";
import { Contracts } from "../../../web3/Contracts";
import { userState } from "../../state/user-state";
import { MyLandItem } from "./MyLandItem";

export const MyLands = () => {
  const { address } = useAccount();
  const user = userState();
  return (
    <div className="flex flex-col w-11/12 pt-4 space-y-4">
      {user.landsBalanceByIds.map((l) => (
        <MyLandItem key={l} landId={l} />
      ))}
    </div>
  );
};
