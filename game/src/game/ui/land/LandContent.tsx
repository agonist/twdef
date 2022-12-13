import { BigNumber } from "ethers";
import { useAccount, useContractReads } from "wagmi";
import { LandAbi } from "../../../abi/Land";
import { Contracts } from "../../../web3/Contracts";
import { userState } from "../../state/user-state";
import { ApproveOr } from "../ApproveOr";
import { StackLandAndTower } from "../stack/StackLandAndTower";
import { UnstackLandAndTower } from "../stack/UnstackLandAndTower";
import { MyTowers } from "../tower/MyTower";
import { ConnectWalletOr } from "../wallet/ConnectWalletOr";
import { LandProps } from "./LandProps";
import { MintLand } from "./MintLand";

export const LandContent = ({ landId }: LandProps) => {
  const { address } = useAccount();
  const user = userState();

  const { data, isError, isLoading, isSuccess, refetch } = useContractReads({
    contracts: [
      {
        address: Contracts.LAND,
        abi: LandAbi,
        functionName: "landInfo",
        args: [BigNumber.from(1), BigNumber.from(landId)],
      },
      {
        address: Contracts.LAND,
        abi: LandAbi,
        functionName: "ownerOf",
        args: [BigNumber.from(landId)],
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

  if (isSuccess && data?.[0].minted && data?.[1] === address) {
    return (
      <ApproveOr>
        <div className="flex flex-col w-full">
          <p>BUILD TOWER</p>
          <MyTowers landId={landId} />
        </div>
      </ApproveOr>
    );
  }

  if (isSuccess && data?.[0].minted && user.stakedLandTowerByIds.has(landId)) {
    return (
      <div>
        <p>your staked land</p>
        <p>
          Land #{landId} with tower#{user.stakedLandTowerByIds.get(landId)}
        </p>
        <UnstackLandAndTower
          landId={landId}
          towerId={user.stakedLandTowerByIds.get(landId)!}
        />
      </div>
    );
  }

  if (isSuccess && data?.[0].minted && data?.[1] !== address) {
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
            minted={data?.[0].minted}
            landId={landId}
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
