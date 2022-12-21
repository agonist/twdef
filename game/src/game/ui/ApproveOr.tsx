import { useAccount } from "wagmi";
import { userState } from "../state/user-state";
import { ApproveGamezForLandz } from "./land/ApproveGamezForLandz";
import { ApproveGamezForTowerz } from "./tower/ApproveGamezForTowerz";
import { LayoutProps } from "./wallet/ConnectWalletOr";

export const ApproveOr = ({ children }: LayoutProps) => {
  const user = userState();

  if (user.landzToGamezApproved && user.towerzToGamezApproved) {
    return <div>{children}</div>;
  }

  return (
    <div className=" card card-compact card-side w-12/12 bg-base-100 shadow-md shadow-pinkz">
      <div className="flex flex-col p-2">
        <p className=" text-pinkz font-bold text-2xl">Approve contracts</p>
        <p className="text-sm text-yellow-200">
          In order to build a tower, you need first to approve the Land contract
          and the Tower contract
        </p>
        <div className="flex h-full py-2 items-end space-x-2">
          {!user.landzToGamezApproved ? <ApproveGamezForLandz /> : <></>}
          {!user.towerzToGamezApproved ? <ApproveGamezForTowerz /> : <></>}
        </div>
      </div>
    </div>
  );
};
