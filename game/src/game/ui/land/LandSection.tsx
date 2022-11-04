import { LandContent } from "./LandContent";
import { LandProps } from "./LandProps";

export const LandSection = ({ land }: LandProps) => {
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
