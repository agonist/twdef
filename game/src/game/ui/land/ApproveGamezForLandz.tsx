import { toast } from "react-toastify";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { LandAbi } from "../../../abi/Land";
import { Contracts } from "../../../web3/Contracts";
import { userState } from "../../state/user-state";

export const ApproveGamezForLandz = () => {
  const setLandzApproved = userState((u) => u.setLandzApproved);

  const { config } = usePrepareContractWrite({
    address: Contracts.LAND,
    abi: LandAbi,
    functionName: "setApprovalForAll",
    // @ts-ignore
    args: [Contracts.GAMEZ, true],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite({
    ...config,
    onSuccess(data) {
      setLandzApproved(true);
      toast.success("Land approved successfully 🥳");
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
