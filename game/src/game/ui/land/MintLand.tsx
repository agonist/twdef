import { BigNumber, ethers } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { LandAbi } from "../../../abi/Land";
import { Contracts } from "../../../web3/Contracts";
import { Land } from "../../state/game-state";
import { LandProps } from "./LandProps";
import { toast } from "react-toastify";
import { userState } from "../../state/user-state";
import { ShopV1Abi } from "../../../abi/ShopV1";

export const MintLand = ({ landId, minted, mintCallback }: LandProps) => {
  const addInLandsBalance = userState((s) => s.addInLandsBalance);

  const { config } = usePrepareContractWrite({
    address: Contracts.SHOP_V1,
    abi: ShopV1Abi,
    functionName: "purchaseCombo",
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
      addInLandsBalance(landId);
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
