import { toast } from "react-toastify";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
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

  const { data, isLoading, isSuccess, write } = useContractWrite({
    ...config,
    onSuccess(data) {
      unstake(landId, towerId);
      successCallback?.();
      toast.success("Unstaked successfully 🥳");
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
