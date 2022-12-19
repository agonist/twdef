import { BigNumber, ethers } from "ethers";
import Image from "next/image";
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
        <div className=" card flex flex-col w-11/12 bg-base-100 shadow-md shadow-pinkz">
          <figure>
            <Image src={"/land.png"} width={300} height={300} />
            <Image src={"/firetower.jpeg"} width={300} height={300} />
          </figure>

          <div className="flex flex-col p-2">
            <p className="text-primary-content text-pinkz font-bold text-2xl">
              LAND #{landId}
            </p>
            <p>Damage Bonus: </p>
          </div>
        </div>

        <MyTowers landId={landId} />
      </ApproveOr>
    );
  }

  if (isSuccess && data?.[0].minted && user.stakedLandTowerByIds.has(landId)) {
    return (
      <div className=" card flex flex-col w-11/12 bg-base-100 shadow-md shadow-pinkz">
        <figure>
          <Image src={"/land.png"} width={300} height={300} />
          <Image src={"/firetower.jpeg"} width={300} height={300} />
        </figure>

        <div className="flex flex-col p-2">
          <p className="text-primary-content text-pinkz font-bold text-2xl">
            LAND #{landId} + TOWER #{user.stakedLandTowerByIds.get(landId)}
          </p>
          <p>Damage Bonus: </p>
        </div>
        <div className="card-actions justify-start px-2 pb-2">
          <ConnectWalletOr>
            <UnstackLandAndTower
              landId={landId}
              towerId={user.stakedLandTowerByIds.get(landId)!}
            />
          </ConnectWalletOr>
        </div>
      </div>
    );
  }

  if (isSuccess && data?.[0].minted && data?.[1] !== address) {
    return (
      <div className=" card flex flex-col w-11/12 bg-base-100 shadow-md shadow-pinkz">
        <figure>
          <Image src={"/land.png"} width={300} height={300} />
          <Image src={"/firetower.jpeg"} width={300} height={300} />
        </figure>

        <div className="flex flex-col p-2">
          <p className="text-primary-content text-pinkz font-bold text-2xl">
            LAND #{landId} + TOWER #{user.stakedLandTowerByIds.get(landId)}
          </p>
          <p>
            owned by{" "}
            <span className="text-sm text-white">
              {data?.[1].substring(0, 20) + "..."}
            </span>
          </p>
          <p>Damage Bonus: </p>
        </div>
      </div>
    );
  }

  if (isSuccess && !data?.[0].minted) {
    return (
      <div className="flex flex-col items-center">
        <div className=" card flex flex-col w-12/12 bg-base-100 shadow-md shadow-pinkz">
          <figure>
            <Image src={"/land.png"} width={300} height={300} />{" "}
          </figure>

          <div className="flex flex-col p-2">
            <p className="text-primary-content text-pinkz font-bold text-2xl">
              LAND #{landId}
            </p>
            <p>Damage Bonus: </p>
          </div>
          <div className="card-actions justify-start px-2 pb-2">
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
        </div>
      </div>
    );
  }

  return <></>;
};
