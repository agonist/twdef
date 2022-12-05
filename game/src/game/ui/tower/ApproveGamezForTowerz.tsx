import { toast } from "react-toastify";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { LandAbi } from "../../../abi/Land";
import { TowerzAbi } from "../../../abi/Towerz";
import { Contracts } from "../../../web3/Contracts";
import { userState } from "../../state/user-state";

export const ApproveGamezForTowerz = () => {
  const setTowerzApproved = userState((u) => u.setTowerzApproved);

  const { config } = usePrepareContractWrite({
    address: Contracts.TOWERZ,
    abi: TowerzAbi,
    functionName: "setApprovalForAll",
    // @ts-ignore
    args: [Contracts.GAMEZ, true],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite({
    ...config,
    onSuccess(data) {
      setTowerzApproved(true);
      toast.success("Towerz approved successfully 🥳");
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
      Approve
    </button>
  );
};
