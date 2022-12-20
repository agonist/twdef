import Image from "next/image";
import { ConnectWalletOr } from "../wallet/ConnectWalletOr";
import { LandProps } from "./LandProps";
import { MintLand } from "./MintLand";

export const BuyLandItem = ({ landId, minted, mintCallback }: LandProps) => {
  return (
    <div className=" card card-compact card-side w-11/12 bg-base-100 shadow-md shadow-pinkz">
      <figure>
        <Image src={"/land.png"} width={130} height={130} alt={"land img"} />
      </figure>

      <div className="flex flex-col pl-2">
        <p className=" text-pinkz font-bold text-2xl">LAND#{landId}</p>
        <p className="text-yellow-200 text-sm">+20% dmg</p>
        <div className="flex h-full pb-2 items-end">
          <ConnectWalletOr>
            <MintLand
              minted={minted}
              landId={landId}
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
