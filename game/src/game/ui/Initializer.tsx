import { BigNumber } from "ethers";
import { useEffect } from "react";
import { useAccount, useContractReads } from "wagmi";
import { LandAbi } from "../../abi/Land";
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
    ],
    onSuccess(data) {
      const ids = data[0].map((id) => BigNumber.from(id).toNumber());
      user.setLandsBalance(ids);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  return <></>;
};
