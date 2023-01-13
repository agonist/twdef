import { BigNumber } from "ethers";
import { useEffect } from "react";
import { useAccount, useContractReads } from "wagmi";
import { GamezAbi } from "../../abi/Gamez";
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
        address: Contracts.TOWERZ,
        abi: TowerzAbi,
        functionName: "balanceByIdOf",
        args: [address!!],
      },
      {
        address: Contracts.GAMEZ,
        abi: GamezAbi,
        functionName: "getStakedTokens",
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
      const landsIds = data[0].map((id) => BigNumber.from(id).toNumber());
      const towersIds = data[1].map((id) => BigNumber.from(id).toNumber());
      const stackedLandsIds = data[2][0].map((id) =>
        BigNumber.from(id).toNumber()
      );
      const stackedTowersIds = data[2][1].map((id) =>
        BigNumber.from(id).toNumber()
      );
      // const allLands = [...landsIds, ...stackedLandsIds];

      user.setLandsBalance(landsIds);
      user.setTowersBalance(towersIds);
      user.setStakedLandsTowersBalance(stackedLandsIds, stackedTowersIds);

      
      const landzApproved = data[3];
      const towerzApproved = data[4];

      user.setContractApproved(landzApproved, towerzApproved);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  return <></>;
};
