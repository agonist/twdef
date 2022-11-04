import { BigNumber } from "ethers";
import { useContractReads } from "wagmi";
import { LandAbi } from "../../../abi/Land";
import { Contracts } from "../../../web3/Contracts";
import { ConnectWalletOr } from "../wallet/ConnectWalletOr";
import { LandProps } from "./LandProps";
import { MintLand } from "./MintLand";

export const LandContent = ({ land }: LandProps) => {
  const { data, isError, isLoading, isSuccess, refetch } = useContractReads({
    contracts: [
      {
        address: Contracts.LAND,
        abi: LandAbi,
        functionName: "lands",
        args: [BigNumber.from(land?.id)],
      },
      {
        address: Contracts.LAND,
        abi: LandAbi,
        functionName: "ownerOf",
        args: [BigNumber.from(land?.id)],
      },
    ],
    onSuccess(data) {
      console.log("Success", data);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  if (isLoading) {
    return <></>;
  }

  if (isSuccess && data?.[0].minted) {
    return (
      <div>
        <p className="text-accent">
          Current owner
          <br />
          <span className="text-sm text-white">{data?.[1]}</span>
        </p>
      </div>
    );
  }

  if (isSuccess && !data?.[0].minted) {
    return (
      <div className="flex flex-col items-center">
        <p className="text-white my-4">
          Buy this land and start building towers
        </p>
        <ConnectWalletOr>
          <MintLand
            land={land}
            mintCallback={() => {
              refetch();
            }}
          />
        </ConnectWalletOr>
      </div>
    );
  }

  return <></>;
};
