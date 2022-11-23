import { BigNumber, ethers } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { LandAbi } from "../../../abi/Land";
import { Contracts } from "../../../web3/Contracts";
import { Land } from "../../state/game-state";
import { LandProps } from "./LandProps";
import { toast } from "react-toastify";

export const MintLand = ({ landId, minted, mintCallback }: LandProps) => {
  const { config } = usePrepareContractWrite({
    address: Contracts.LAND,
    abi: LandAbi,
    functionName: "mint",
    args: [BigNumber.from(1), BigNumber.from(landId)],
    overrides: {
      value: ethers.utils.parseEther("1"),
    },
    enabled: !minted,
  });

  const { data, isLoading, isSuccess, write } = useContractWrite({
    ...config,
    onSuccess(data) {
      mintCallback?.();
      toast.success("Land bought successfully 🥳");
    },
    onError(data) {
      console.log(data);
    },
  });

  return (
    <button
      className={"btn btn-secondary " + (isLoading ? "loading" : "")}
      onClick={() => {
        write?.();
      }}
    >
      BUY FOR 1 $MATIC
    </button>
  );
};
