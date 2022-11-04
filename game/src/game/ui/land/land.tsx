import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BigNumber } from "ethers";
import { useContractReads } from "wagmi";
import { LandAbi } from "../../../abi/Land";
import { Contracts } from "../../../web3/Contracts";
import { gameState } from "../../state/game-state";
import { ConnectWalletOr } from "../wallet/ConnectWalletOr";
import { LandProps } from "./LandProps";
import { MintLand } from "./MintLand";

export const Land = ({ land }: LandProps) => {
  return (
    <div className="flex flex-col w-full items-center pb-4">
      <div className="flex w-full justify-center items-center bg-primary h-8">
        <p className="text-black text-xl">
          Land #{land?.id} ( {land?.x}, {land?.y} )
        </p>
      </div>

      <LandContent land={land} />
    </div>
  );
};

const LandContent = ({ land }: LandProps) => {
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
