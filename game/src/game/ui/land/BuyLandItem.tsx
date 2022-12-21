import Image from "next/image";
import { ConnectWalletOr } from "../wallet/ConnectWalletOr";
import { emojiForLandType } from "./LandContent";
import { LandProps } from "./LandProps";
import { LandTitle } from "./LandTitle";
import { MintLand } from "./MintLand";

export const BuyLandItem = ({
  minted,
  mintCallback,
  land,
  landId,
}: LandProps) => {
  if (land === undefined) return <></>;

  return (
    <div className=" card card-compact card-side w-11/12 bg-base-100 shadow-md shadow-pinkz">
      <figure>
        <Image src={land?.image!} width={130} height={130} alt={"land img"} />
      </figure>

      <div className="flex flex-col pl-2">
        <LandTitle land={land} landId={landId} />
        <div className="flex h-full pb-2 items-end">
          <ConnectWalletOr>
            <MintLand
              landId={landId}
              land={land}
              minted={minted}
              mintCallback={() => {
                mintCallback!();
              }}
            />
          </ConnectWalletOr>
        </div>
      </div>
    </div>
  );
};
