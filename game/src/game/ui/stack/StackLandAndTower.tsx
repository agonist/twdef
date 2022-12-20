import { toast } from "react-toastify";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { GamezAbi } from "../../../abi/Gamez";
import { Contracts } from "../../../web3/Contracts";
import { log } from "../../helpers/logger";
import { userState } from "../../state/user-state";

export interface LandTowerPair {
  landId: number;
  towerId: number;
  successCallback?: () => void;
}

export const StackLandAndTower = ({
  landId,
  towerId,
  successCallback,
}: LandTowerPair) => {
  const stake = userState((s) => s.stake);

  const { config } = usePrepareContractWrite({
    address: Contracts.GAMEZ,
    abi: GamezAbi,
    functionName: "stakeLandAndTower",
    // functionName: "unstakeLandAndTower",
    // @ts-ignore
    args: [landId, towerId],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite({
    ...config,
    onSuccess(data) {
      stake(landId, towerId);
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
        BUILD
      </button>
    </div>
  );
};
