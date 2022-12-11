import { toast } from "react-toastify";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { GamezAbi } from "../../../abi/Gamez";
import { Contracts } from "../../../web3/Contracts";
import { MyTowers } from "../tower/MyTower";

interface LandTowerPair {
  landId: number;
  towerId: number;
}

export const StackLandAndTower = ({ landId, towerId }: LandTowerPair) => {
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
      toast.success("Staked successfully 🥳");
    },
    onError(data) {
      console.log(data);
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
