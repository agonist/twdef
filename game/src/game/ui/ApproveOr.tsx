import { useAccount } from "wagmi";
import { userState } from "../state/user-state";
import { ApproveGamezForLandz } from "./land/ApproveGamezForLandz";
import { ApproveGamezForTowerz } from "./tower/ApproveGamezForTowerz";
import { LayoutProps } from "./wallet/ConnectWalletOr";

export const ApproveOr = ({ children }: LayoutProps) => {
  const user = userState();

  if (!user.landzToGamezApproved) {
    return (
      <div className="flex flex-col w-11/12 items-center">
        <p className="text-center">
          You need to approve the game contract for Lands first.
        </p>
        <ApproveGamezForLandz />
      </div>
    );
  }

  if (!user.towerzToGamezApproved) {
    return (
      <div className="flex flex-col w-11/12 items-center">
        <p className="text-center">
          You need to approve the game contract for Towers first.
        </p>
        <ApproveGamezForTowerz />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">{children}</div>
  );
};
