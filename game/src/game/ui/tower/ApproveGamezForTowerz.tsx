import { toast } from "react-toastify";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
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

  const { data, write } = useContractWrite({
    ...config
  });

    const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
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
      className={"btn btn-xs btn-secondary " + (isLoading ? "loading" : "")}
      onClick={() => {
        write?.();
      }}
    >
      Approve Tower
    </button>
  );
};
