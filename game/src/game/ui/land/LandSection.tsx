import { ApproveOr } from "../ApproveOr";
import { StackLandAndTower } from "../stack/StackLandAndTower";

import { LandContent } from "./LandContent";
import { LandProps } from "./LandProps";

export const LandSection = ({ landId }: LandProps) => {
  return (
    <div className="flex flex-col w-full items-center py-4">
      <div className="flex w-full justify-center items-center bg-primary h-10">
        <p className="text-primary-content font-bold text-xl">Land #{landId}</p>
      </div>

      <LandContent landId={landId} />
    </div>
  );
};
