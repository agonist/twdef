import { TowerData, TowerProps } from "./MyTowerItem";

export const TowerTitle = ({ tower }: TowerProps) => {
  function emojiForTowerType(tower: TowerData) {
    const l = tower.attributes.find((a) => a.trait_type === "Type");
    switch (l?.value) {
      case "FIRE": {
        return "🔥";
      }
      case "ICE": {
        return "🧊";
      }
      case "JUNGLE": {
        return "🌴";
      }
    }
  }

  return (
    <p className=" text-pinkz font-bold text-2xl">
      {emojiForTowerType(tower)} {tower.name}
    </p>
  );
};
