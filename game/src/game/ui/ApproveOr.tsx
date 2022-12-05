import { useAccount } from "wagmi";
import { userState } from "../state/user-state";
import { ApproveGamezForLandz } from "./land/ApproveGamezForLandz";
import { ApproveGamezForTowerz } from "./tower/ApproveGamezForTowerz";
import { LayoutProps } from "./wallet/ConnectWalletOr";

export const ApproveOr = ({ children }: LayoutProps) => {
  const user = userState();

  if (!user.landzToGamezApproved) {
    return <ApproveGamezForLandz />;
  }

  if (!user.towerzToGamezApproved) {
    return <ApproveGamezForTowerz />;
  }

  return <div>{children}</div>;
};
