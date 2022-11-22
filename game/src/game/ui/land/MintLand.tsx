import { BigNumber, ethers } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { LandAbi } from "../../../abi/Land";
import { Contracts } from "../../../web3/Contracts";
import { Land } from "../../state/game-state";
import { LandProps } from "./LandProps";
import { toast } from "react-toastify";

export const MintLand = ({ landId, mintCallback }: LandProps) => {
  const { config } = usePrepareContractWrite({
    address: Contracts.LAND,
    abi: LandAbi,
    functionName: "mint",
    args: [BigNumber.from(landId)],
    overrides: {
      value: ethers.utils.parseEther("1"),
    },
    enabled: !land.minted,
  });

  const { data, isLoading, isSuccess, write } = useContractWrite({
    ...config,
    onSuccess(data) {
      mintCallback?.();
      toast.success("Land bought successfully 🥳");
    },
  });

  return (
    <button
      className={"btn btn-secondary " + (isLoading ? "loading" : "")}
      onClick={() => {
        write?.();
      }}
    >
      BUY FOR 100 $MATIC
    </button>
  );
};
