import { LandContent } from "./LandContent";
import { LandProps } from "./LandProps";

export const LandSection = ({ land }: LandProps) => {
  return (
    <div className="flex flex-col w-full items-center py-4">
      <div className="flex w-full justify-center items-center bg-primary h-10">
        <p className="text-primary-content font-bold text-xl">
          Land #{land?.id} ( {land?.x}, {land?.y} )
        </p>
      </div>

      <LandContent land={land} />
    </div>
  );
};
