import { toast } from "react-toastify";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { GamezAbi } from "../../../abi/Gamez";
import { Contracts } from "../../../web3/Contracts";
import { log } from "../../helpers/logger";
import { userState } from "../../state/user-state";
import { LandTowerPair } from "./StackLandAndTower";

export const UnstackLandAndTower = ({
  landId,
  towerId,
  successCallback,
}: LandTowerPair) => {
  const unstake = userState((s) => s.unstake);

  const { config } = usePrepareContractWrite({
    address: Contracts.GAMEZ,
    abi: GamezAbi,
    functionName: "unstakeLandAndTower",
    // @ts-ignore
    args: [landId, towerId],
  });

  const { data, write } = useContractWrite({
    ...config,
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      unstake(landId, towerId);
      successCallback?.();
      toast.success("Staked successfully 🥳");
    },
    onError(data) {
      log.error(data);
    },
  });

  return (
    <div>
      <button
        className={"btn btn-xs btn-secondary " + (isLoading ? "loading" : "")}
        onClick={() => {
          write?.();
        }}
      >
        Unbuild
      </button>
    </div>
  );
};
