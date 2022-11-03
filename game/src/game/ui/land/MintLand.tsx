import { BigNumber, ethers } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { LandAbi } from "../../../abi/Land";
import { Contracts } from "../../../web3/Contracts";
import { Land } from "../../state/game-state";
import { LandProps } from "./LandProps";

export const MintLand = ({ land }: LandProps) => {
  const { config } = usePrepareContractWrite({
    address: Contracts.LAND,
    abi: LandAbi,
    functionName: "mint",
    args: [BigNumber.from(land.id)],
    overrides: {
      value: ethers.utils.parseEther("1"),
    },
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  return (
    <button
      className="group relative inline-block focus:outline-none focus:ring"
      onClick={() => {
        write?.();
      }}
    >
      <span className="absolute inset-0 translate-x-0 translate-y-0 bg-purplz transition-transform group-hover:translate-y-1 group-hover:translate-x-1"></span>

      <span className="relative inline-block border-white border border-current px-8 py-3 text-sm font-bold text-white uppercase tracking-widest">
        BUY FOR 100 $MATIC
      </span>
    </button>
  );
};
