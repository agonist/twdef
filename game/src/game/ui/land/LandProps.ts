import { Land } from "../../state/game-state";

export interface LandProps {
  landId: number;
  mintCallback?: () => void
}