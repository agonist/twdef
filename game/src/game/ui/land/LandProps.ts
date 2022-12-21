import { Land } from "../../state/game-state";
import { LandData } from "./LandContent";

export interface LandProps {
  land?: LandData;
  landId: number;
  minted?: boolean;
  mintCallback?: () => void;
}
