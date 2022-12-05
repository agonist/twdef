import { BigNumber } from "ethers";
import { useEffect } from "react";
import { useAccount, useContractReads } from "wagmi";
import { LandAbi } from "../../abi/Land";
import { TowerzAbi } from "../../abi/Towerz";
import { Contracts } from "../../web3/Contracts";
import { userState } from "../state/user-state";

export const Initializer = () => {
  const { address } = useAccount();

  const user = userState();

  const { data, isError, isLoading, isSuccess, refetch } = useContractReads({
    contracts: [
      {
        address: Contracts.LAND,
        abi: LandAbi,
        functionName: "balanceByIdOf",
        args: [address!!],
      },
      {
        address: Contracts.LAND,
        abi: LandAbi,
        functionName: "isApprovedForAll",
        // @ts-ignore
        args: [address, Contracts.GAMEZ],
      },
      {
        address: Contracts.TOWERZ,
        abi: TowerzAbi,
        functionName: "isApprovedForAll",
        // @ts-ignore
        args: [address, Contracts.GAMEZ],
      },
    ],
    onSuccess(data) {
      const ids = data[0].map((id) => BigNumber.from(id).toNumber());
      user.setLandsBalance(ids);

      const landzApproved = data[1];
      const towerzApproved = data[2];

      user.setContractApproved(landzApproved, towerzApproved);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  return <></>;
};
