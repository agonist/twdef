import { emojiForLandType } from "./LandContent";
import { LandProps } from "./LandProps";

export const LandTitle = ({ land }: LandProps) => {
  return (
    <p className=" text-pinkz font-bold text-2xl">
      {emojiForLandType(land!)} {land?.name}
    </p>
  );
};
